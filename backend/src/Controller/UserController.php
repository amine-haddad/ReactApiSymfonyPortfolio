<?php

// src/Controller/UserController.php

// src/Controller/UserController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UserController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')] // 🔒 Protège l'accès
    public function me(): JsonResponse
    {
        $user = $this->getUser();
        
        if (!$user) {
            return new JsonResponse(['error' => 'Utilisateur non authentifié'], 401);
        }

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUserIdentifier(), // getUsername() est obsolète en Symfony 5+
            'email' => $user->getEmail(),
            // Ajoute d'autres champs ici si nécessaire
        ]);
    }
}
