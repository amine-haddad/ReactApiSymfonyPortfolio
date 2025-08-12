<?php

namespace App\Controller;

use App\Entity\Skill;
use App\Repository\SkillRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class SkillController extends AbstractController
{
    #[Route('/api/skills', name: 'api_skills_list', methods: ['GET'])]
    public function list(Request $request, SkillRepository $repository, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        // Récupère tous les profils de l'utilisateur connecté
        $profiles = $em->getRepository(\App\Entity\Profile::class)->findBy(['user' => $user]);
        $profileIds = array_map(fn($p) => $p->getId(), $profiles);

        // Récupère toutes les skills liées à ces profils (ManyToMany)
        $qb = $em->createQueryBuilder()
            ->select('s')
            ->from(\App\Entity\Skill::class, 's')
            ->join('s.profileSkills', 'ps')
            ->join('ps.profile', 'p')
            ->where('ps.profile IN (:profileIds)')
            ->setParameter('profileIds', $profileIds);

        $range = $request->query->get('range');
        if ($range) {
            $range = json_decode($range, true);
            $start = $range[0];
            $end = $range[1];
            $limit = $end - $start + 1;
            $page = floor($start / $limit) + 1;
            $qb->setFirstResult($start)
               ->setMaxResults($limit);
        } else {
            $page = max(1, (int)$request->query->get('page', 1));
            $limit = max(1, (int)$request->query->get('limit', 10));
            $qb->setFirstResult(($page - 1) * $limit)
               ->setMaxResults($limit);
        }

        // Tri des résultats
        $sortParam = $request->query->get('sort', $request->query->get('_sort', 'id'));
        $orderParam = $request->query->get('order', $request->query->get('_order', 'ASC'));

        // Si le tri est envoyé sous forme de tableau JSON (ex: ["slug","DESC"])
        if (is_string($sortParam) && str_starts_with($sortParam, '[')) {
            $sortArray = json_decode($sortParam, true);
            $sort = $sortArray[0] ?? 'id';
            $order = strtoupper($sortArray[1] ?? 'ASC');
        } else {
            $sort = $sortParam;
            $order = strtoupper($orderParam);
        }

        if (!in_array($order, ['ASC', 'DESC'])) {
            $order = 'ASC';
        }
        // Retire le tri sur 'profiles'
        if ($sort === 'profiles') {
            // Ne rien faire, ou trier par défaut sur 's.id'
            $qb->orderBy('s.id', $order);
        } else {
            $qb->orderBy('s.' . $sort, $order);
        }

        $skills = $qb->getQuery()->getResult();

        // Compte total pour la pagination
        $totalQb = $em->createQueryBuilder()
            ->select('COUNT(DISTINCT s.id)')
            ->from(\App\Entity\Skill::class, 's')
            ->join('s.profileSkills', 'ps')
            ->where('ps.profile IN (:profileIds)')
            ->setParameter('profileIds', $profileIds);
        $total = $totalQb->getQuery()->getSingleScalarResult();

        $data = [];
        foreach ($skills as $skill) {
            $profiles = [];
            foreach ($skill->getProfileSkills() as $ps) {
                $profile = $ps->getProfile();
                if ($profile && $profile->getUser()?->getId() === $user->getId()) {
                    $profiles[] = [
                        'id' => $profile->getId(),
                        'name' => $profile->getName(),
                        'user' => $profile->getUser()->getId(),
                    ];
                }
            }
            $images = [];
            foreach ($skill->getImages() as $img) {
                $images[] = [
                    'id' => $img->getId(),
                    'name' => $img->getName(),
                    'url' => method_exists($img, 'getUrl') ? $img->getUrl() : $img->getName(),
                ];
            }
            $data[] = [
                'id' => $skill->getId(),
                'name' => $skill->getName(),
                'slug' => $skill->getSlug(),
                'created_at' => $skill->getCreatedAt()?->format('Y-m-d H:i:s'), // Ajoute cette ligne
                'updated_at' => $skill->getUpdatedAt()?->format('Y-m-d H:i:s'), // Ajoute cette ligne
                'profiles' => $profiles,
                'images' => $images,
            ];
        }

        $response = new JsonResponse($data);
        $response->headers->set('Content-Range', 'skills ' . (($page - 1) * $limit) . '-' . (($page - 1) * $limit + count($data) - 1) . '/' . $total);
        $response->headers->set('Access-Control-Expose-Headers', 'Content-Range');
        return $response;
    }

    #[Route('/api/skills/{id}', name: 'api_skill_show', methods: ['GET'])]
    public function show(Skill $skill): JsonResponse
    {
        $user = $this->getUser(); // Ajoute cette ligne
        $profiles = [];
        foreach ($skill->getProfileSkills() as $ps) {
            $profile = $ps->getProfile();
            // Filtre : n’ajoute que les profils de l’utilisateur connecté
            if ($profile && $profile->getUser()?->getId() === $user->getId()) {
                $profiles[] = [
                    'id' => $profile->getId(),
                    'name' => $profile->getName(),
                ];
            }
        }
        $images = [];
        foreach ($skill->getImages() as $img) {
            $images[] = [
                'id' => $img->getId(),
                'name' => $img->getName(),
                'url' => method_exists($img, 'getUrl') ? $img->getUrl() : $img->getName(),
            ];
        }
        $data = [
            'id' => $skill->getId(),
            'name' => $skill->getName(),
            'slug' => $skill->getSlug(),
            'created_at' => $skill->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updated_at' => $skill->getUpdatedAt()?->format('Y-m-d H:i:s'),
            'profiles' => $profiles,
            'images' => array_map(function($img) {
                return [
                    'id' => $img->getId(),
                    'name' => $img->getName(),
                    'url' => method_exists($img, 'getUrl') ? $img->getUrl() : $img->getName(),
                ];
            }, $skill->getImages()->toArray()),
        ];
        return new JsonResponse($data);
    }

    #[Route('/api/skills', name: 'api_skill_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $skill = new Skill();
        $name = $data['name'] ?? '';
        $skill->setName($name);

        // Utilise le slugger pour générer le slug
        $slug = !empty($data['slug']) ? $data['slug'] : $slugger->slug($name)->lower();
        $skill->setSlug($slug);

        $skill->setCreatedAt(new \DateTime());
        $skill->setUpdatedAt(new \DateTime());

        // Associe le profil
        if (!empty($data['profile'])) {
            $profile = $em->getRepository(\App\Entity\Profile::class)->find($data['profile']);
            if ($profile) {
                $profileSkill = new \App\Entity\ProfileSkill();
                $profileSkill->setProfile($profile);
                $profileSkill->setSkill($skill);
                $profileSkill->setLevel($data['level'] ?? 1); // valeur par défaut si non renseignée
                $em->persist($profileSkill);
            }
        }

        // Associe les images existantes (si tu utilises ReferenceArrayInput)
        if (!empty($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $imgData) {
                if (isset($imgData['id'])) {
                    $img = $em->getRepository(\App\Entity\Image::class)->find($imgData['id']);
                    if ($img) {
                        $skill->addImage($img);
                    }
                }
            }
        }
        if (!empty($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $imgData) {
                if (isset($imgData['src'])) {
                    $base64 = $imgData['src'];
                    // Si c'est une URL externe (ex: picsum)
                    if (filter_var($base64, FILTER_VALIDATE_URL)) {
                        $image = new \App\Entity\Image();
                        $image->setName($base64); // stocke l'URL
                        $image->setSkills($skill);
                        $skill->addImage($image);
                        $em->persist($image);
                    } else {
                        // Sinon, c'est du base64, donc upload local
                        $parts = explode(',', $base64);
                        $decoded = base64_decode(end($parts));
                        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/images/skills/';
                        if (!is_dir($uploadDir)) {
                            mkdir($uploadDir, 0777, true);
                        }
                        $filename = uniqid().'.jpg';
                        $filepath = $uploadDir . $filename;
                        file_put_contents($filepath, $decoded);

                        $image = new \App\Entity\Image();
                        $image->setName('/uploads/images/skills/' . $filename); // chemin relatif
                        $image->setSkills($skill);
                        $skill->addImage($image);
                        $em->persist($image);
                    }
                }
            }
        }

        $em->persist($skill);
        $em->flush();

        $responseData = [
            'id' => $skill->getId(),
            'name' => $skill->getName(),
            'slug' => $skill->getSlug(),
            'created_at' => $skill->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updated_at' => $skill->getUpdatedAt()?->format('Y-m-d H:i:s'),
            'profiles' => isset($profile) ? [
                [
                    'id' => $profile->getId(),
                    'name' => $profile->getName(),
                ]
            ] : [],
            'images' => array_map(function($img) {
                return [
                    'id' => $img->getId(),
                    'name' => $img->getName(),
                    'url' => method_exists($img, 'getUrl') ? $img->getUrl() : $img->getName(),
                ];
            }, $skill->getImages()->toArray()),
        ];
        return new JsonResponse($responseData, 201);
    }

    #[Route('/api/skills/{id}', name: 'api_skill_update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $skill = $em->getRepository(Skill::class)->find($id);
        if (!$skill) {
            return new JsonResponse(['error' => 'Not found'], 404);
        }

        // Mise à jour des champs simples
        $skill->setName($request->get('name', $skill->getName()));
        $skill->setSlug($request->get('slug', $skill->getSlug()));
        $skill->setUpdatedAt(new \DateTime());

        // Mise à jour des images existantes (si payload JSON)
        $data = json_decode($request->getContent(), true);
        if (isset($data['images']) && is_array($data['images'])) {
            foreach ($skill->getImages() as $img) {
                $skill->removeImage($img);
            }
            foreach ($data['images'] as $imgData) {
                if (isset($imgData['id'])) {
                    $img = $em->getRepository(\App\Entity\Image::class)->find($imgData['id']);
                    if ($img) {
                        $skill->addImage($img);
                    }
                }
            }
        }

        // Gestion des fichiers uploadés (si multipart)
        if ($request->files->has('images')) {
            foreach ($request->files->get('images') as $uploadedFile) {
                $image = new \App\Entity\Image();
                $image->setName($uploadedFile->getClientOriginalName());
                $filename = uniqid().'.'.$uploadedFile->guessExtension();
                $uploadedFile->move('/chemin/vers/tes/images/', $filename);
                $image->setUrl('/chemin/vers/tes/images/' . $filename);
                $image->setSkills($skill);
                $skill->addImage($image);
                $em->persist($image);
            }
        }

        $em->flush();
        return new JsonResponse(['id' => $skill->getId()]);
    }

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
}
