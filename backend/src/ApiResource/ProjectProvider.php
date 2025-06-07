<?php
namespace App\ApiResource;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Project;
use App\Entity\Profile;
use Doctrine\ORM\EntityManagerInterface;

class ProjectProvider implements ProviderInterface
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        // Récupère l'ID du profil depuis les variables de l'URI
        $profileId = $uriVariables['profileId'] ?? null;

        if (!$profileId) {
            throw new \InvalidArgumentException('ID de profil manquant');
        }

        // Recherche du profil
        $profile = $this->entityManager->getRepository(Profile::class)->find($profileId);

        if (!$profile) {
            throw new \RuntimeException('Profil non trouvé');
        }

        // Retourne les projets associés au profil
        return $this->entityManager->getRepository(Project::class)->findBy(['profile' => $profile]);
    }
}