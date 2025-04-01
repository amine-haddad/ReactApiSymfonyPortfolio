<?php
// src/Security/CustomJWTPayloadFactory.php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class CustomJWTPayloadFactory
{
    private JWTTokenManagerInterface $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    /**
     * Crée un payload pour le JWT avec les informations personnalisées (ID, username, email, etc.).
     *
     * @param UserInterface $user
     * @return array
     */
    public function createPayload(UserInterface $user): array
    {
        return [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            // Ajoute d'autres informations ici si nécessaire
        ];
    }
}
