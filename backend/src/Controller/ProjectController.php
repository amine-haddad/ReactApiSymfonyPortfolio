<?php

// src/Controller/ProjectController.php

namespace App\Controller;

use App\Entity\Profile;
use App\Entity\Project;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use OpenApi\Annotations as OA;
use Nelmio\ApiDocBundle\Annotation\Model;

class ProjectController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
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
        // Recherche du profil par son ID
        $profile = $this->entityManager->getRepository(Profile::class)->find($profileId);

        if (!$profile) {
            return new JsonResponse(['error' => 'Profil non trouvé'], 404);
        }

        // Recherche des projets associés à ce profil
        $projects = $this->entityManager
            ->getRepository(Project::class)
            ->findBy(['profile' => $profile]);

        // Retourne les projets associés
        return $this->json($projects, 200, [], ['groups' => 'read:Project']);
    }

    #[Route('/api/profiles/{profileId}/projects/{projectId}', name: 'api_project_by_profile', methods: ['GET'])]
    
    public function getProjectByProfile($profileId, $projectId): JsonResponse
    {
        // Check if the profile exists
        $profile = $this->entityManager->getRepository(Profile::class)->find($profileId);

        if (!$profile) {
            return new JsonResponse(['error' => 'Profil non trouvé'], 404);
        }

        // Check if the project exists and belongs to the profile
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
