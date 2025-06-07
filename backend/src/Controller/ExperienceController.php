<?php

namespace App\Controller;

use App\Entity\Profile;
use App\Entity\Experience;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use OpenApi\Annotations as OA;
use Nelmio\ApiDocBundle\Annotation\Model;

class ExperienceController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @OA\Get(
     *     path="/api/profiles/{profileId}/experiences",
     *     summary="Liste des expériences d'un profil",
     *     @OA\Parameter(
     *         name="profileId",
     *         in="path",
     *         required=true,
     *         description="Identifiant du profil",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Retourne la liste des expériences",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref=@Model(type=Experience::class, groups={"read:Experience"}))
     *         )
     *     )
     * )
     */
    #[Route('/api/profiles/{profileId}/experiences', name: 'api_experiences_by_profile', methods: ['GET'])]
    public function getExperiencesByProfile($profileId): JsonResponse
    {
        // Recherche du profil par son ID
        $profile = $this->entityManager->getRepository(Profile::class)->find($profileId);

        if (!$profile) {
            return new JsonResponse(['error' => 'Profil non trouvé'], 404);
        }

        // Recherche des expériences associées à ce profil
        $experiences = $this->entityManager
            ->getRepository(Experience::class)
            ->findBy(['profile' => $profile]);

        // Retourne les expériences associées
        return $this->json($experiences, 200, [], ['groups' => 'read:Experience']);
    }

    /**
     * @OA\Get(
     *     path="/api/profiles/{profileId}/experiences/{experienceId}",
     *     summary="Détails d'une expérience d'un profil",
     *     @OA\Parameter(
     *         name="profileId",
     *         in="path",
     *         required=true,
     *         description="Identifiant du profil",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Parameter(
     *         name="experienceId",
     *         in="path",
     *         required=true,
     *         description="Identifiant de l'expérience",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Retourne les détails de l'expérience",
     *         @OA\JsonContent(ref=@Model(type=Experience::class, groups={"read:Experience"}))
     *     )
     * )
     */
    #[Route('/api/profiles/{profileId}/experiences/{experienceId}', name: 'api_experience_by_profile', methods: ['GET'])]
    public function getExperienceByProfile($profileId, $experienceId): JsonResponse
    {
        // Recherche du profil par son ID
        $profile = $this->entityManager->getRepository(Profile::class)->find($profileId);

        if (!$profile) {
            return new JsonResponse(['error' => 'Profil non trouvé'], 404);
        }

        // Recherche de l'expérience associée au profil
        $experience = $this->entityManager->getRepository(Experience::class)->findOneBy([
            'id' => $experienceId,
            'profile' => $profile
        ]);

        if (!$experience) {
            return new JsonResponse(['error' => 'Expérience non trouvée ou n\'appartient pas au profil'], 404);
        }

        // Retourne les détails de l'expérience
        return $this->json($experience, 200, [], ['groups' => 'read:Experience']);
    }
}
