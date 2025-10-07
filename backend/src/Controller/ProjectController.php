<?php

// src/Controller/ProjectController.php

namespace App\Controller;

use App\Entity\Profile;
use App\Entity\Project;
use App\Entity\Image;
use App\Entity\Skill;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use OpenApi\Annotations as OA;
use Nelmio\ApiDocBundle\Annotation\Model;

class ProjectController extends AbstractController
{
    private EntityManagerInterface $entityManager;
    private RequestStack $requestStack;

    public function __construct(EntityManagerInterface $entityManager, RequestStack $requestStack)
    {
        $this->entityManager = $entityManager;
        $this->requestStack = $requestStack;
    }

    /**
     * @OA\Get(
     *     path="/api/profiles/{profileId}/projects",
     *     summary="Liste des projets d'un profil",
     *     @OA\Parameter(
     *         name="profileId",
     *         in="path",
     *         required=true,
     *         description="Identifiant du profil",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Retourne la liste des projets",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref=@Model(type=Project::class, groups={"read:Project"}))
     *         )
     *     )
     * )
     */

    #[Route('/api/profiles/{profileId}/projects', name: 'api_projects_by_profile', methods: ['GET'])]
    public function getProjectsByProfile($profileId): JsonResponse
    {
        $profile = $this->entityManager->getRepository(Profile::class)->find($profileId);

        if (!$profile) {
            return new JsonResponse(['error' => 'Profil non trouvé'], 404);
        }

        // Récupération des paramètres de pagination
        $request = $this->requestStack->getCurrentRequest();
        $page = max(1, (int)$request->query->get('page', 1));
        $limit = max(1, (int)$request->query->get('limit', 10));
        $offset = ($page - 1) * $limit;

        // Total des projets pour ce profil
        $total = $this->entityManager
            ->getRepository(Project::class)
            ->count(['profile' => $profile]);

        // Recherche paginée des projets associés à ce profil
        $projects = $this->entityManager
            ->getRepository(Project::class)
            ->findBy(['profile' => $profile], [], $limit, $offset);

        // Retourne les projets associés + total
        return $this->json([
            'data' => $projects,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
        ], 200, [], ['groups' => 'read:Project']);
    }

    #[Route('/api/profiles/{profileId}/projects/{projectId}', name: 'api_project_by_profile', methods: ['GET'])]
    public function getProjectByProfile($profileId, $projectId): JsonResponse
    {
        $profile = $this->entityManager->getRepository(Profile::class)->find($profileId);

        if (!$profile) {
            return new JsonResponse(['error' => 'Profil non trouvé'], 404);
        }

        $project = $this->entityManager->getRepository(Project::class)->findOneBy([
            'id' => $projectId,
            'profile' => $profile
        ]);

        if (!$project) {
            return new JsonResponse(['error' => 'Projet non trouvé ou n\'appartient pas au profil'], 404);
        }

        return $this->json($project, 200, [], ['groups' => 'read:Project']);
    }

    #[Route('/api/projects', name: 'api_projects_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $user = $this->getUser();
        $profileRepo = $this->entityManager->getRepository(Profile::class);

        $profiles = $profileRepo->findBy(['user' => $user]);
        $profileIds = array_map(fn($p) => $p->getId(), $profiles);

        $page = max(1, (int)$request->query->get('page', 1));
        $limit = max(1, (int)$request->query->get('limit', 10));
        $offset = ($page - 1) * $limit;

        $sortParam = $request->query->get('sort', 'id');
        $orderParam = $request->query->get('order', 'ASC');

        // Si le tri est envoyé sous forme de tableau JSON (ex: ["description","DESC"])
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

        $qb = $this->entityManager->createQueryBuilder()
            ->select('p')
            ->from(Project::class, 'p')
            ->where('p.profile IN (:profileIds)')
            ->setParameter('profileIds', $profileIds)
            ->setFirstResult($offset)
            ->setMaxResults($limit);

        if ($sort === 'profile' || $sort === 'profile.name') {
            // Ignore le tri sur profile ou profile.name, utilise l'id par défaut
            $qb->orderBy('p.id', $order);
        } else {
            $qb->orderBy('p.' . $sort, $order);
        }

        $projects = $qb->getQuery()->getResult();

        // Pour le total
        $totalQb = $this->entityManager->createQueryBuilder()
            ->select('COUNT(p.id)')
            ->from(Project::class, 'p')
            ->where('p.profile IN (:profileIds)')
            ->setParameter('profileIds', $profileIds);
        $total = $totalQb->getQuery()->getSingleScalarResult();

        $data = [];
        foreach ($projects as $project) {
            $profile = $project->getProfile();
            $data[] = [
                'id' => $project->getId(),
                'title' => $project->getTitle(),
                'slug' => $project->getSlug(),
                'description' => $project->getDescription(),
                'project_url' => $project->getProjectUrl(),
                'image_url' => $project->getImageUrl(),
                'created_at' => $project->getCreatedAt()?->format('Y-m-d\TH:i:s'),
                'updated_at' => $project->getUpdatedAt()?->format('Y-m-d\TH:i:s'),
                'profile' => $profile ? [
                    'id' => $profile->getId(),
                    'name' => $profile->getName(),
                    'user' => $profile->getUser()?->getId(),
                ] : null,
                'images' => array_map(function($image) {
                    return [
                        'id' => $image->getId(),
                        'name' => $image->getName(),
                        'url' => filter_var($image->getName(), FILTER_VALIDATE_URL)
                            ? $image->getName()
                            : '/uploads/images/' . $image->getName(),
                    ];
                }, $project->getImages()->toArray()),
                'technologies' => array_map(function($tech) {
                    return [
                        'id' => $tech->getId(),
                        'name' => $tech->getName(),
                        'slug' => $tech->getSlug(),
                    ];
                }, $project->getTechnologies()->toArray()),
            ];
        }

        $response = new JsonResponse(['data' => $data]);
        $response->headers->set(
            'Content-Range',
            "projects $offset-" . (min($offset + $limit - 1, $total - 1)) . "/$total"
        );
        $response->headers->set('Access-Control-Expose-Headers', 'Content-Range');
        return $response;
    }

    #[Route('/api/projects/{id}', name: 'api_project_show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $repo = $this->entityManager->getRepository(Project::class);
        $project = $repo->find($id);

        if (!$project) {
            return new JsonResponse(['error' => 'Projet non trouvé'], 404);
        }

        $profile = $project->getProfile();

        return $this->json([
            'id' => $project->getId(),
            'title' => $project->getTitle(),
            'description' => $project->getDescription(),
            'slug' => $project->getSlug(),
            'project_url' => $project->getProjectUrl(),
            'image_url' => $project->getImageUrl(),
            'created_at' => $project->getCreatedAt(),
            'updated_at' => $project->getUpdatedAt(),
            'profile' => $profile ? [
                'id' => $profile->getId(),
                'name' => $profile->getName(),
                'user' => $profile->getUser()?->getId(),
            ] : null,
            'images' => array_map(function($image) {
                return [
                    'id' => $image->getId(),
                    'name' => $image->getName(),
                    'url' => filter_var($image->getName(), FILTER_VALIDATE_URL)
                    ? $image->getName()
                    : '/uploads/images/' . $image->getName(),
                ];
            }, $project->getImages()->toArray()),
            // <-- ICI : retourne id + name + slug pour la show
            'technologies' => array_map(function($tech) {
                return [
                    'id' => $tech->getId(),
                    'name' => $tech->getName(),
                    'slug' => $tech->getSlug(),
                ];
            }, $project->getTechnologies()->toArray()),
        ]);
    }

    #[Route('/api/projects/{id}', name: 'api_project_edit', methods: ['PUT', 'PATCH'])]
    public function edit(Request $request, int $id): JsonResponse
    {
        $repo = $this->entityManager->getRepository(Project::class);
        $project = $repo->find($id);

        if (!$project) {
            return new JsonResponse(['error' => 'Projet non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);

        // Champs simples
        $project->setTitle($data['title'] ?? $project->getTitle());
        $project->setSlug($data['slug'] ?? $project->getSlug());
        $project->setDescription($data['description'] ?? $project->getDescription());
        $project->setProjectUrl($data['project_url'] ?? $project->getProjectUrl());
        $project->setImageUrl($data['image_url'] ?? $project->getImageUrl());

        // Profil (ManyToOne)
        if (isset($data['profile']['id'])) {
            $profile = $this->entityManager->getRepository(Profile::class)->find($data['profile']['id']);
            if ($profile) {
                $project->setProfile($profile);
            }
        }

        // Technologies (ManyToMany)
        if (isset($data['technologies']) && is_array($data['technologies'])) {
            $project->getTechnologies()->clear();
            foreach ($data['technologies'] as $techData) {
                if (isset($techData['id'])) {
                    $tech = $this->entityManager->getRepository(Skill::class)->find($techData['id']);
                    if ($tech) {
                        $project->addTechnology($tech);
                    }
                }
            }
        }

        // Images (OneToMany) - ici on ne gère que les URLs, pas l'upload
        if (isset($data['images']) && is_array($data['images'])) {
            // Optionnel : supprimer les anciennes images si besoin
            foreach ($project->getImages() as $img) {
                $project->removeImage($img);
                $this->entityManager->remove($img);
            }
            foreach ($data['images'] as $imgData) {
                if (isset($imgData['url'])) {
                    $image = new Image();
                    $image->setImageName($imgData['url']); // ou setUrl si tu ajoutes ce champ
                    $image->setProject($project);
                    $project->addImage($image);
                    $this->entityManager->persist($image);
                }
            }
        }

        $this->entityManager->flush();

        return $this->json(['success' => true]);
    }
}
