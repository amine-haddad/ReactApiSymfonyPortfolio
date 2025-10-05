<?php

namespace App\Controller;

use App\Entity\Skill;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

/**
 * Contrôleur API pour la gestion des compétences (skills) côté admin.
 * Gère la liste, la création, la mise à jour, la suppression et l'affichage détaillé.
 */
class SkillController extends AbstractController
{
    /**
     * Liste paginée des skills de l'utilisateur connecté, avec profils et images associés.
     */
    #[Route('/api/skills', name: 'api_skills_list', methods: ['GET'])]
    public function list(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof \App\Entity\User) {
            throw new \LogicException('User not found or not the right type');
        }

        // Récupère les profils de l'utilisateur
        $profiles = $em->getRepository(\App\Entity\Profile::class)->findBy(['user' => $user]);
        $profileIds = array_map(fn($p) => $p->getId(), $profiles);

        // Pagination (React Admin)
        $range = $request->query->get('range');
        if ($range) {
            $range = json_decode($range, true);
            $start = $range[0];
            $end = $range[1];
            $limit = $end - $start + 1;
        } else {
            $start = 0;
            $limit = 10;
            $end = $start + $limit - 1;
        }

        // Récupère les skills liés à ces profils
        $qb = $em->createQueryBuilder()
            ->select('DISTINCT s')
            ->from(Skill::class, 's')
            ->join('s.profileSkills', 'ps')
            ->join('ps.profile', 'p')
            ->where('ps.profile IN (:profileIds)')
            ->setParameter('profileIds', $profileIds)
            ->setFirstResult($start)
            ->setMaxResults($limit);

        $skills = $qb->getQuery()->getResult();

        // Calcule le total pour la pagination
        $totalQb = $em->createQueryBuilder()
            ->select('COUNT(DISTINCT s.id)')
            ->from(Skill::class, 's')
            ->join('s.profileSkills', 'ps')
            ->where('ps.profile IN (:profileIds)')
            ->setParameter('profileIds', $profileIds);
        $total = $totalQb->getQuery()->getSingleScalarResult();

        $backendHost = 'http://localhost:8000';
        $data = [];
        foreach ($skills as $skill) {
            // Liste des profils associés à ce skill pour l'utilisateur courant
            $profiles = [];
            foreach ($skill->getProfileSkills() as $ps) {
                $profile = $ps->getProfile();
                if ($profile && $profile->getUser()?->getId() === $user->getId()) {
                    $profiles[] = [
                        'id' => $profile->getId(),
                        'name' => $profile->getName(),
                        'level' => $ps->getLevel(),
                        'profileSkillId' => $ps->getId(),
                    ];
                }
            }
            // Images associées
            $images = [];
            foreach ($skill->getImages() as $img) {
                $imgName = $img->getImageName();
                $isAbsolute = preg_match('/^https?:\/\//i', $imgName);
                $url = $isAbsolute ? $imgName : $backendHost . '/uploads/images/skills/' . ltrim($imgName, '/');
                $images[] = [
                    'id' => $img->getId(),
                    'imageName' => $imgName,
                    'url' => $url,
                ];
            }
            $data[] = [
                'id' => $skill->getId(),
                'name' => $skill->getName(),
                'slug' => $skill->getSlug(),
                'created_at' => $skill->getCreatedAt()?->format('Y-m-d H:i:s'),
                'updated_at' => $skill->getUpdatedAt()?->format('Y-m-d H:i:s'),
                'profiles' => $profiles,
                'images' => $images,
            ];
        }
        $response = new JsonResponse($data);
        $response->headers->set('Content-Range', 'skills ' . $start . '-' . ($start + count($data) - 1) . '/' . $total);
        $response->headers->set('Access-Control-Expose-Headers', 'Content-Range');
        return $response;
    }

    /**
     * Création d'une nouvelle compétence (skill) avec profils et images associés.
     */
    #[Route('/api/skills', name: 'api_skill_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        $name = trim($request->request->get('name', ''));
        if (empty($name)) {
            return new JsonResponse(['error' => 'Le nom de la compétence est obligatoire'], 400);
        }

        $em->getConnection()->beginTransaction();
        try {
            $currentUser = $this->getUser();

            // Vérifie si le skill existe déjà
            $skill = $em->getRepository(Skill::class)->findOneBy(['name' => $name]);
            if (!$skill) {
                $skill = new Skill();
                $skill->setName($name);
                $slug = $request->request->get('slug') ?: $slugger->slug($name)->lower();
                $skill->setSlug($slug);
                $skill->setCreatedAt(new \DateTime());
                $skill->setUpdatedAt(new \DateTime());
                $em->persist($skill);
            }

            // Associe les profils avec leur niveau
            $profiles = $request->request->all('profiles');
            foreach ($profiles as $profileData) {
                if (is_string($profileData)) {
                    $profileData = json_decode($profileData, true);
                }
                if (!isset($profileData['id'])) continue;
                $profile = $em->getRepository(\App\Entity\Profile::class)->find($profileData['id']);
                if ($profile) {
                    $profileSkill = new \App\Entity\ProfileSkill();
                    $profileSkill->setProfile($profile);
                    $profileSkill->setSkill($skill);
                    $level = isset($profileData['level']) ? (int)$profileData['level'] : 1;
                    $profileSkill->setLevel($level);
                    $em->persist($profileSkill);
                }
            }

            // Ajoute les images uploadées
            foreach ($request->files->get('images', []) as $uploadedFile) {
                $image = new \App\Entity\Image();
                $image->setSkillFile($uploadedFile);
                $image->setSkills($skill);
                $skill->addImage($image);
                $em->persist($image);
            }

            $em->flush();
            $em->getConnection()->commit();

            $requestSchemeAndHost = $request->getSchemeAndHttpHost();
            $responseData = [
                'id' => $skill->getId(),
                'name' => $skill->getName(),
                'slug' => $skill->getSlug(),
                'created_at' => $skill->getCreatedAt()?->format('Y-m-d H:i:s'),
                'updated_at' => $skill->getUpdatedAt()?->format('Y-m-d H:i:s'),
                'profiles' => array_map(function($ps) {
                    return [
                        'id' => $ps->getProfile()->getId(),
                        'name' => $ps->getProfile()->getName(),
                        'level' => $ps->getLevel(),
                    ];
                }, $skill->getProfileSkills()->toArray()),
                'images' => array_map(function($img) use ($requestSchemeAndHost) {
                    $imgName = $img->getImageName();
                    $isAbsolute = preg_match('/^https?:\/\//i', $imgName);
                    $url = $isAbsolute ? $imgName : $requestSchemeAndHost . '/uploads/images/skills/' . ltrim($imgName, '/');
                    return [
                        'id' => $img->getId(),
                        'imageName' => $imgName,
                        'url' => $url,
                    ];
                }, $skill->getImages()->toArray()),
            ];
            return new JsonResponse($responseData, 201);
        } catch (\Throwable $e) {
            $em->getConnection()->rollBack();
            return new JsonResponse(['error' => 'Erreur lors de la création de la compétence : ' . $e->getMessage()], 500);
        }
    }

    /**
     * Mise à jour d'une compétence (skill) : profils, niveaux, images, nom, slug.
     */
    #[Route('/api/skills/{id}', name: 'api_skill_update', methods: ['PUT', 'PATCH', 'POST'])]
    public function update(Request $request, Skill $skill, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        $data = $request->request->all();
        $deletedImageIds = array_map('intval', $request->get('deletedImageIds', []));
        $existingImages = $request->get('existingImages', []);
        $uploadedFiles = $request->files->get('images', []);

        // 1. Supprime les images demandées
        foreach ($deletedImageIds as $imgId) {
            $img = $em->getRepository(\App\Entity\Image::class)->find($imgId);
            if ($img && $img->getSkills() === $skill) {
                $em->remove($img);
            }
        }

        // 2. Met à jour les noms des images existantes
        foreach ($existingImages as $imgData) {
            if (is_string($imgData)) $imgData = json_decode($imgData, true);
            if (!isset($imgData['id'])) continue;
            $img = $em->getRepository(\App\Entity\Image::class)->find((int)$imgData['id']);
            if (!$img || in_array($img->getId(), $deletedImageIds, true)) continue;
            $imgName = $imgData['imageName'] ?? $img->getImageName();
            $img->setImageName($imgName);
            $em->persist($img);
        }

        // 3. Ajoute les nouveaux fichiers uploadés
        foreach ($uploadedFiles as $idx => $file) {
            $img = new \App\Entity\Image();
            $img->setSkillFile($file);
            $img->setSkills($skill);
            $imgName = $request->get('imageNames', [])[$idx] ?? $file->getClientOriginalName();
            $img->setImageName($imgName);
            $em->persist($img);
            $skill->addImage($img);
        }

        // 4. Met à jour les champs du skill (nom, slug)
        if (isset($data['name'])) {
            $skill->setName($data['name']);
            $skill->setSlug($slugger->slug($data['name'])->lower());
        }

        // 5. Gère les profils associés et leur niveau
        if (isset($data['profiles']) && is_array($data['profiles'])) {
            foreach ($data['profiles'] as $profileData) {
                if (is_string($profileData)) {
                    $profileData = json_decode($profileData, true);
                }
                // Si profileSkillId existe, on l'utilise pour la mise à jour
                if (isset($profileData['profileSkillId'])) {
                    $profileSkill = $em->getRepository(\App\Entity\ProfileSkill::class)
                        ->find($profileData['profileSkillId']);
                } else {
                    // Sinon, recherche par profile_id et skill_id
                    if (!isset($profileData['id'])) continue;
                    $profileSkill = $em->getRepository(\App\Entity\ProfileSkill::class)
                        ->findOneBy([
                            'profile' => $profileData['id'],
                            'skill' => $skill->getId()
                        ]);
                }
                // Met à jour le niveau si la jointure existe
                if ($profileSkill && isset($profileData['level'])) {
                    $profileSkill->setLevel((int)$profileData['level']);
                    $em->persist($profileSkill);
                }
                // Crée la jointure si elle n'existe pas
                if (!$profileSkill && isset($profileData['id']) && isset($profileData['level'])) {
                    $profile = $em->getRepository(\App\Entity\Profile::class)->find($profileData['id']);
                    if ($profile) {
                        $profileSkill = new \App\Entity\ProfileSkill();
                        $profileSkill->setProfile($profile);
                        $profileSkill->setSkill($skill);
                        $profileSkill->setLevel((int)$profileData['level']);
                        $em->persist($profileSkill);
                    }
                }
            }
        }

        $em->flush();

        // Prépare la réponse avec profils et images à jour
        $backendHost = 'http://localhost:8000';
        $profiles = [];
        foreach ($skill->getProfileSkills() as $ps) {
            $profile = $ps->getProfile();
            $profileUser = $profile ? $profile->getUser() : null;
            $currentUser = $this->getUser();
            if (
                $profileUser instanceof \App\Entity\User &&
                $currentUser instanceof \App\Entity\User &&
                $profileUser->getId() === $currentUser->getId()
            ) {
                $profiles[] = [
                    'id' => $profile->getId(),
                    'name' => $profile->getName(),
                    'level' => $ps->getLevel(),
                ];
            }
        }
        $images = [];
        foreach ($skill->getImages() as $img) {
            $imgName = $img->getImageName();
            $isAbsolute = preg_match('/^https?:\/\//i', $imgName);
            $url = $isAbsolute ? $imgName : $backendHost . '/uploads/images/skills/' . ltrim($imgName, '/');
            $images[] = [
                'id' => $img->getId(),
                'imageName' => $imgName,
                'url' => $url,
            ];
        }
        $data = [
            'id' => $skill->getId(),
            'name' => $skill->getName(),
            'slug' => $skill->getSlug(),
            'created_at' => $skill->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updated_at' => $skill->getUpdatedAt()?->format('Y-m-d H:i:s'),
            'profiles' => $profiles,
            'images' => $images,
        ];
        return new JsonResponse($data, 200);
    }

    /**
     * Suppression d'une compétence (skill) par son id.
     */
    #[Route('/api/skills/{id}', name: 'api_skill_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $skill = $em->getRepository(Skill::class)->find($id);
        if (!$skill) {
            return new JsonResponse(['error' => 'Not found'], 404);
        }
        $em->remove($skill);
        $em->flush();
        return new JsonResponse(null, 204);
    }

    /**
     * Liste simple de tous les skills de l'utilisateur (id, name, slug).
     */
    #[Route('/api/skills/all', name: 'api_skills_all', methods: ['GET'])]
    public function all(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof \App\Entity\User) {
            throw new \LogicException('User not found or not the right type');
        }

        $profiles = $em->getRepository(\App\Entity\Profile::class)->findBy(['user' => $user]);
        $profileIds = array_map(fn($p) => $p->getId(), $profiles);

        $skills = $em->createQueryBuilder()
            ->select('s')
            ->from(Skill::class, 's')
            ->join('s.profileSkills', 'ps')
            ->join('ps.profile', 'p')
            ->where('ps.profile IN (:profileIds)')
            ->setParameter('profileIds', $profileIds)
            ->getQuery()
            ->getResult();

        $data = [];
        foreach ($skills as $skill) {
            $data[] = [
                'id' => $skill->getId(),
                'name' => $skill->getName(),
                'slug' => $skill->getSlug(),
            ];
        }

        return new JsonResponse($data);
    }

    /**
     * Affichage détaillé d'une compétence (skill) avec profils et images associés.
     */
    #[Route('/api/skills/{id}', name: 'api_skill_show', methods: ['GET'])]
    public function show(Skill $skill): JsonResponse
    {
        $user = $this->getUser();
        if (!$user instanceof \App\Entity\User) {
            throw new \LogicException('User not found or not the right type');
        }
        $backendHost = 'http://localhost:8000';
        $profiles = [];
        foreach ($skill->getProfileSkills() as $ps) {
            $profile = $ps->getProfile();
            if ($profile && $profile->getUser()?->getId() === $user->getId()) {
                $profiles[] = [
                    'id' => $profile->getId(),
                    'name' => $profile->getName(),
                    'level' => $ps->getLevel(),
                ];
            }
        }
        $images = [];
        foreach ($skill->getImages() as $img) {
            $imgName = $img->getImageName();
            $isAbsolute = preg_match('/^https?:\/\//i', $imgName);
            $url = $isAbsolute ? $imgName : $backendHost . '/uploads/images/skills/' . ltrim($imgName, '/');
            $images[] = [
                'id' => $img->getId(),
                'imageName' => $imgName,
                'url' => $url,
            ];
        }
        $data = [
            'id' => $skill->getId(),
            'name' => $skill->getName(),
            'slug' => $skill->getSlug(),
            'created_at' => $skill->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updated_at' => $skill->getUpdatedAt()?->format('Y-m-d H:i:s'),
            'profiles' => $profiles,
            'images' => $images,
        ];
        return new JsonResponse($data);
    }
}
