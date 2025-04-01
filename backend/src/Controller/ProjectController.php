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

class ProjectController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/projects/{profileId}', name: 'api_projects_by_profile', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')] // Protège l'accès à cette API
    public function getProjectsByProfile($profileId): JsonResponse
    {
        // Récupère l'utilisateur connecté
        $user = $this->getUser();  

        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
        }

        // Recherche du profil par son ID et s'assurer qu'il appartient à l'utilisateur connecté
        $profile = $this->entityManager->getRepository(Profile::class)->find($profileId);

        if (!$profile || $profile->getUser() !== $user) {
            return new JsonResponse(['error' => 'Profil non trouvé ou non autorisé'], 403);
        }

        // Recherche des projets associés à ce profil
        $projects = $this->entityManager
            ->getRepository(Project::class)
            ->findBy(['profile' => $profile]);

        if (!$projects) {
            return new JsonResponse(['message' => 'Aucun projet trouvé pour ce profil'], 404);
        }

        return $this->json($projects, 200, [], ['groups' => 'project:read']);
    }
}
