<?php

namespace App\Security\Authenticator;

use App\Security\CustomJWTPayloadFactory;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTManager;

class JWTAuthenticator
{
    private $jwtManager;
    private $jwtPayloadFactory;

    public function __construct(JWTManager $jwtManager, CustomJWTPayloadFactory $jwtPayloadFactory)
    {
        $this->jwtManager = $jwtManager;
        $this->jwtPayloadFactory = $jwtPayloadFactory;
    }

    // Méthode pour créer un token à partir de l'utilisateur
    public function createToken(UserInterface $user): string
    {
        // Créer un token classique via JWTManager
        $token = $this->jwtManager->create($user); // Utilise l'utilisateur directement

        // À ce moment, tu peux ajouter ou modifier des données dans le token via un listener
        // Le listener (par exemple, `JWTCreatedListener`) se charge d'ajouter des infos au payload

        return $token;
    }

    // Tu peux aussi gérer l'authentification via token dans cette classe
    public function authenticate(TokenInterface $token): ?TokenInterface
    {
        // Logique pour authentifier un utilisateur à partir du token
        return $token;
    }
}
