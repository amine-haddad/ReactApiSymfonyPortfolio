<?php
/** @var \App\Entity\User $user */
namespace App\Controller;

use App\Entity\Profile;
use App\Repository\ProfileRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ProfileController extends AbstractController
{
    // Liste paginée des profils (admin voit tout, sinon que ses propres profils)
    #[Route('/api/profiles', name: 'api_profiles_list', methods: ['GET'])]
    public function list(ProfileRepository $repository, Request $request): JsonResponse
    {
        $user = $this->getUser();

        // Récupération des paramètres React-Admin (tri, pagination, filtre)
        $sortParam  = $request->query->get('sort', '["id","ASC"]');
        $rangeParam = $request->query->get('range', '[0,9]');
        $filterRaw  = $request->query->get('filter', '{}');
        $sortArr    = json_decode($sortParam, true);
        $rangeArr   = json_decode($rangeParam, true);
        $filter     = json_decode($filterRaw, true);
        if (! is_array($filter)) {
            $filter = [];
        }
        $q = $filter['q'] ?? '';

        $sort  = $sortArr[0] ?? 'id';
        $order = $sortArr[1] ?? 'ASC';
        $start = $rangeArr[0] ?? 0;
        $end   = $rangeArr[1] ?? 9;

        // Mapping des champs React-Admin vers Doctrine
        $fieldMap = [
            'id'        => 'id',
            'name'      => 'name',
            'title'     => 'title',
            'email'     => 'email',
            'slug'      => 'slug',
            'createdAt' => 'createdAt', // Ajoute ceci
            'updatedAt' => 'updatedAt', // Et ceci
        ];
        if (isset($fieldMap[$sort])) {
            $sort = $fieldMap[$sort];
        } else {
            $sort = 'id';
        }

        // Construction du QueryBuilder
        $qb = $repository->createQueryBuilder('p');

        // Si non admin, ne voir que ses propres profils
        if (! in_array('ROLE_ADMIN', $user->getRoles())) {
            $qb->andWhere('p.user = :user')->setParameter('user', $user);
        }

        // Recherche sur name, title, email
        if ($q) {
            $qb->andWhere('p.name LIKE :q OR p.title LIKE :q OR p.email LIKE :q')
                ->setParameter('q', "%$q%");
        }

        // Tri
        $qb->orderBy('p.' . $sort, $order);

        // Pagination
        $qb->setFirstResult($start)
            ->setMaxResults($end - $start);

        $profiles = $qb->getQuery()->getResult();

        // Calcul du total pour Content-Range
        $countQb = $repository->createQueryBuilder('p');
        if (! in_array('ROLE_ADMIN', $user->getRoles())) {
            $countQb->andWhere('p.user = :user')->setParameter('user', $user);
        }
        if ($q) {
            $countQb->andWhere('p.name LIKE :q OR p.title LIKE :q OR p.email LIKE :q')
                ->setParameter('q', "%$q%");
        }
        $total = $countQb->select('COUNT(p.id)')->getQuery()->getSingleScalarResult();

        // Formatage des données pour la réponse
        $data = [];
        foreach ($profiles as $profile) {
            $data[] = $this->serializeProfileShort($profile);
        }

        $response = new JsonResponse($data);
        $response->headers->set('Content-Range', "profiles $start-" . (min($end - 1, $total - 1)) . "/$total");
        $response->headers->set('Access-Control-Expose-Headers', 'Content-Range');

        return $response;
    }

    // Affiche un profil (admin ou propriétaire uniquement)
    #[Route('/api/profiles/{id}', name: 'api_profiles_detail', methods: ['GET'])]
    public function show(Profile $profile = null): JsonResponse
    {
        $user = $this->getUser();
        if (! $profile) {
            return $this->json(['error' => 'Not found'], 404);
        }
        // Sécurité : seul l'admin ou le propriétaire peut accéder
        if ($user instanceof \App\Entity\User) {
            if (! in_array('ROLE_ADMIN', $user->getRoles()) && $profile->getUser()?->getId() !== $user->getId()) {
                return $this->json(['error' => 'Forbidden'], 403);
            }
        }
        return $this->json($this->serializeProfile($profile));
    }

    // Modification d'un profil (admin ou propriétaire uniquement)
    #[Route('/api/profiles/{id}', name: 'api_profiles_edit', methods: ['PUT', 'PATCH'])]
    public function edit(Request $request, Profile $profile = null, ManagerRegistry $doctrine): JsonResponse
    {
        $user = $this->getUser();
        if (! $profile) {
            return $this->json(['error' => 'Not found'], 404);
        }
        // Sécurité : seul l'admin ou le propriétaire peut modifier
        if ($user instanceof \App\Entity\User) {
            if (! in_array('ROLE_ADMIN', $user->getRoles()) && $profile->getUser()?->getId() !== $user->getId()) {
                return $this->json(['error' => 'Forbidden'], 403);
            }
        }
        $data = json_decode($request->getContent(), true);
        if (isset($data['name'])) {
            $profile->setName($data['name']);
        }

        if (isset($data['title'])) {
            $profile->setTitle($data['title']);
        }

        if (isset($data['bio'])) {
            $profile->setBio($data['bio']);
        }

        if (isset($data['email'])) {
            $profile->setEmail($data['email']);
        }

        if (isset($data['github_url'])) {
            $profile->setGithubUrl($data['github_url']);
        }

        if (isset($data['linkedin_url'])) {
            $profile->setLinkedinUrl($data['linkedin_url']);
        }

        if (isset($data['slug'])) {
            $profile->setSlug($data['slug']);
        }

        // Ajoute ici les autres champs modifiables

        $em = $doctrine->getManager();
        $em->flush();

        return $this->json($this->serializeProfile($profile));
    }

    // Suppression d'un profil (admin ou propriétaire uniquement)
    #[Route('/api/profiles/{id}', name: 'api_profiles_delete', methods: ['DELETE'])]
    public function delete(Profile $profile = null, ManagerRegistry $doctrine): JsonResponse
    {
        $user = $this->getUser();
        if (! $profile) {
            return $this->json(['error' => 'Not found'], 404);
        }
        // Sécurité : seul l'admin ou le propriétaire peut supprimer
        if ($user instanceof \App\Entity\User) {
            if (! in_array('ROLE_ADMIN', $user->getRoles()) && $profile->getUser()?->getId() !== $user->getId()) {
                return $this->json(['error' => 'Forbidden'], 403);
            }
        }
        $id = $profile->getId();
        $em = $doctrine->getManager();
        $em->remove($profile);
        $em->flush();

        return $this->json([
            'id'      => $id,
            'message' => 'Profil supprimé',
        ]);
    }

    // Création d'un profil (toujours pour l'utilisateur connecté)
    #[Route('/api/profiles', name: 'api_profiles_create', methods: ['POST'])]
    public function create(Request $request, ManagerRegistry $doctrine): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $user = $this->getUser();

        $profile = new Profile();
        if (isset($data['name'])) {
            $profile->setName($data['name']);
        }

        if (isset($data['title'])) {
            $profile->setTitle($data['title']);
        }

        if (isset($data['bio'])) {
            $profile->setBio($data['bio']);
        }

        if (isset($data['email'])) {
            $profile->setEmail($data['email']);
        }

        if (isset($data['github_url'])) {
            $profile->setGithubUrl($data['github_url']);
        }

        if (isset($data['linkedin_url'])) {
            $profile->setLinkedinUrl($data['linkedin_url']);
        }

        if (isset($data['slug'])) {
            $profile->setSlug($data['slug']);
        }

        $profile->setUser($user);
        // Ajoute ici les autres champs si besoin

        $em = $doctrine->getManager();
        $em->persist($profile);
        $em->flush();

        return $this->json($this->serializeProfile($profile));
    }

    // Liste publique des profils (tout le monde peut voir)
    #[Route('/api/public/profiles', name: 'api_public_profiles_list', methods: ['GET'])]
    public function publicList(ProfileRepository $repository): JsonResponse
    {
        $profiles = $repository->findAll();
        $data = [];
        foreach ($profiles as $profile) {
            $data[] = $this->serializeProfileShort($profile);
        }
        $response = new JsonResponse([
            'data'  => $data,
            'total' => count($data),
        ]);
        $response->headers->set('Content-Range', "profiles 0-" . (count($data) - 1) . "/" . count($data));
        $response->headers->set('Access-Control-Expose-Headers', 'Content-Range');
        return $response;
    }

    // Affichage public d'un profil (tout le monde peut voir)
    #[Route('/api/public/profiles/{id}', name: 'api_public_profiles_detail', methods: ['GET'])]
    public function publicShow(Profile $profile = null): JsonResponse
    {
        if (! $profile) {
            return $this->json(['error' => 'Not found'], 404);
        }
        return $this->json($this->serializePublicProfile($profile));
    }

    // Profil de l'utilisateur connecté
    #[Route('/api/my/profile', name: 'api_my_profile', methods: ['GET'])]
    public function myProfile(ProfileRepository $repository): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'Not authenticated'], 401);
        }
        $profile = $repository->findOneBy(['user' => $user]);
        if (!$profile) {
            return $this->json(['error' => 'Profile not found'], 404);
        }
        return $this->json($this->serializeProfile($profile));
    }

    // Version courte pour les listes
    private function serializeProfileShort(Profile $profile): array
    {
        return [
            'id'        => $profile->getId(),
            'name'      => $profile->getName(),
            'title'     => $profile->getTitle(),
            'slug'      => $profile->getSlug(),
            'email'     => $profile->getEmail(),
            'creeLe'    => $profile->getCreatedAt()->format('Y-m-d H:i:s'),
            'modifieLe' => $profile->getUpdatedAt() ? $profile->getUpdatedAt()->format('Y-m-d H:i:s') : null,
            'user'      => $profile->getUser()?->getId(),
            'profileSkills' => array_map(fn($ps) => [
                'id'    => $ps->getId(),
                'level' => $ps->getLevel(),
                'skill' => $ps->getSkill() ? [
                    'id'   => $ps->getSkill()->getId(),
                    'name' => $ps->getSkill()->getName(),
                    'slug' => $ps->getSkill()->getSlug(),
                ] : null,
                'pictures' => array_map(function($img) {
                    $imgName = $img->getImageName();
                    $isAbsolute = preg_match('/^https?:\/\//i', $imgName);
                    $url = $isAbsolute
                        ? $imgName
                        : 'http://localhost:8000/uploads/images/profileskills/' . ltrim($imgName, '/');
                    return [
                        'id' => $img->getId(),
                        'name' => $imgName,
                        'url' => $url,
                    ];
                }, $ps->getPictures()->toArray()),
            ], $profile->getProfileSkills()->toArray()),
        ];
    }

    // Version complète pour la fiche profil
    private function serializeProfile(Profile $profile): array
    {
        return [
            'id'            => $profile->getId(),
            'name'          => $profile->getName(),
            'title'         => $profile->getTitle(),
            'bio'           => $profile->getBio(),
            'email'         => $profile->getEmail(),
            'github_url'    => $profile->getGithubUrl(),
            'linkedin_url'  => $profile->getLinkedinUrl(),
            'slug'          => $profile->getSlug(),
            'user'          => $profile->getUser()?->getId(),
            'creeLe'        => $profile->getCreatedAt()?->format('Y-m-d H:i:s'),
            'modifieLe'     => $profile->getUpdatedAt()?->format('Y-m-d H:i:s'),
            'projects'      => array_map(fn($p) => [
                'id'           => $p->getId(),
                'title'        => $p->getTitle(),
                'description'  => $p->getDescription(),
                'slug'         => $p->getSlug(),
                'project_url'  => $p->getProjectUrl(),
                'image_url'    => $p->getImageUrl(),
                'technologies' => array_map(fn($tech) => [
                    'id'   => $tech->getId(),
                    'name' => $tech->getName(),
                    'slug' => $tech->getSlug(),
                ], $p->getTechnologies()->toArray()),
                'images'       => array_map(fn($img) => [
                    'id'   => $img->getId(),
                    'name' => $img->getImageName(),
                    'url'  => (filter_var($img->getImageName(), FILTER_VALIDATE_URL))
                        ? $img->getImageName()
                        : ($img->getImageName() ? '/uploads/images/' . $img->getImageName() : null),
                ], $p->getImages()->toArray()),
            ], $profile->getProjects()->toArray()),
            'experiences'   => array_map(fn($e) => [
                'id'          => $e->getId(),
                'role'        => $e->getRole(),
                'compagny'    => $e->getCompagny(),
                'startDate'   => $e->getStartDate()?->format('Y-m-d'),
                'endDate'     => $e->getEndDate()?->format('Y-m-d'),
                'description' => $e->getDescription(),
                'slug'        => $e->getSlug(),
                'images'      => array_map(fn($img) => [
                    'id'   => $img->getId(),
                    'name' => $img->getImageName(),
                    'url'  => (filter_var($img->getImageName(), FILTER_VALIDATE_URL))
                        ? $img->getImageName()
                        : ($img->getImageName() ? '/uploads/images/' . $img->getImageName() : null),
                ], $e->getImages()->toArray()),
            ], $profile->getExperiences()->toArray()),
            'images'        => array_map(fn($img) => [
                'id'   => $img->getId(),
                'name' => $img->getImageName(),
                'url'  => (filter_var($img->getImageName(), FILTER_VALIDATE_URL))
                    ? $img->getImageName()
                    : ($img->getImageName() ? '/uploads/images/' . $img->getImageName() : null),
                'alt'  => $img->getImageName(),
            ], $profile->getImages()->toArray()),
            'profileSkills' => array_map(fn($ps) => [
                'id'    => $ps->getId(),
                'level' => $ps->getLevel(),
                'skill' => $ps->getSkill() ? [
                    'id'   => $ps->getSkill()->getId(),
                    'name' => $ps->getSkill()->getName(),
                    'slug' => $ps->getSkill()->getSlug(),
                ] : null,
                'pictures' => array_map(function($img) {
                    $imgName = $img->getImageName();
                    $isAbsolute = preg_match('/^https?:\/\//i', $imgName);
                    $url = $isAbsolute
                        ? $imgName
                        : 'http://localhost:8000/uploads/images/profileskills/' . ltrim($imgName, '/');
                    return [
                        'id' => $img->getId(),
                        'name' => $imgName,
                        'url' => $url,
                    ];
                }, $ps->getPictures()->toArray()),
            ], $profile->getProfileSkills()->toArray()),
        ];
    }

    // Version publique pour la partie publique
    private function serializePublicProfile(Profile $profile): array
    {
        return [
            'id'            => $profile->getId(),
            'name'          => $profile->getName(),
            'title'         => $profile->getTitle(),
            'bio'           => $profile->getBio(),
            'email'         => $profile->getEmail(),
            'github_url'    => $profile->getGithubUrl(),
            'linkedin_url'  => $profile->getLinkedinUrl(),
            'slug'          => $profile->getSlug(),
            'creeLe'        => $profile->getCreatedAt()?->format('Y-m-d H:i:s'),
            'modifieLe'     => $profile->getUpdatedAt()?->format('Y-m-d H:i:s'),
            'projects'      => array_map(fn($p) => [
                'id'           => $p->getId(),
                'title'        => $p->getTitle(),
                'description'  => $p->getDescription(),
                'slug'         => $p->getSlug(),
                'project_url'  => $p->getProjectUrl(),
                'image_url'    => $p->getImageUrl(),
                'technologies' => array_map(fn($tech) => [
                    'id'   => $tech->getId(),
                    'name' => $tech->getName(),
                    'slug' => $tech->getSlug(),
                ], $p->getTechnologies()->toArray()),
                'images'       => array_map(fn($img) => [
                    'id'   => $img->getId(),
                    'name' => $img->getImageName(),
                    'url'  => (filter_var($img->getImageName(), FILTER_VALIDATE_URL))
                        ? $img->getImageName()
                        : ($img->getImageName() ? '/uploads/images/' . $img->getImageName() : null),
                ], $p->getImages()->toArray()),
            ], $profile->getProjects()->toArray()),
            'experiences'   => array_map(fn($e) => [
                'id'          => $e->getId(),
                'role'        => $e->getRole(),
                'compagny'    => $e->getCompagny(),
                'startDate'   => $e->getStartDate()?->format('Y-m-d'),
                'endDate'     => $e->getEndDate()?->format('Y-m-d'),
                'description' => $e->getDescription(),
                'slug'        => $e->getSlug(),
                'images'      => array_map(fn($img) => [
                    'id'   => $img->getId(),
                    'name' => $img->getImageName(),
                    'url'  => (filter_var($img->getImageName(), FILTER_VALIDATE_URL))
                        ? $img->getImageName()
                        : ($img->getImageName() ? '/uploads/images/' . $img->getImageName() : null),
                ], $e->getImages()->toArray()),
            ], $profile->getExperiences()->toArray()),
            'images'        => array_map(fn($img) => [
                'id'   => $img->getId(),
                'name' => $img->getImageName(),
                'url'  => (filter_var($img->getImageName(), FILTER_VALIDATE_URL))
                    ? $img->getImageName()
                    : ($img->getImageName() ? '/uploads/images/' . $img->getImageName() : null),
                'alt'  => $img->getImageName(),
            ], $profile->getImages()->toArray()),
            'profileSkills' => array_map(fn($ps) => [
                'id'    => $ps->getId(),
                'level' => $ps->getLevel(),
                'skill' => $ps->getSkill() ? [
                    'id'   => $ps->getSkill()->getId(),
                    'name' => $ps->getSkill()->getName(),
                    'slug' => $ps->getSkill()->getSlug(),
                ] : null,
                'pictures' => array_map(function($img) {
                    $imgName = $img->getImageName();
                    $isAbsolute = preg_match('/^https?:\/\//i', $imgName);
                    $url = $isAbsolute
                        ? $imgName
                        : 'http://localhost:8000/uploads/images/profileskills/' . ltrim($imgName, '/');
                    return [
                        'id' => $img->getId(),
                        'name' => $imgName,
                        'url' => $url,
                    ];
                }, $ps->getPictures()->toArray()),
            ], $profile->getProfileSkills()->toArray()),
        ];
    }
}
