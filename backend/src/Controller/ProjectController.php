<?php

// src/Controller/ProjectController.php

namespace App\Controller;

use App\Entity\Profile;
use App\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
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
}
