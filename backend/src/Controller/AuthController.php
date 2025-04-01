<?php

// src/Controller/AuthController.php

namespace App\Controller;

use App\Security\CustomJWTPayloadFactory;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class AuthController extends AbstractController
{
    private CustomJWTPayloadFactory $jwtPayloadFactory;
    private JWTTokenManagerInterface $jwtManager;

    public function __construct(
        CustomJWTPayloadFactory $jwtPayloadFactory,
        JWTTokenManagerInterface $jwtManager
    ) {
        $this->jwtPayloadFactory = $jwtPayloadFactory;
        $this->jwtManager = $jwtManager;
    }

    #[Route('/api/login_check', name: 'api_login', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function login(JWTTokenManagerInterface $jwtManager): JsonResponse
    {
        $user = $this->getUser();

        $token = $jwtManager->create($user);

        return $this->json([
            'token' => $token,
            'id' => $user->getId(), // Facultatif, car déjà dans le token
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
        ]);
    }
}
