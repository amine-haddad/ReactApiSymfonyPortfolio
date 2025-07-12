<?php
// src/Security/LoginSuccessHandler.php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private JWTTokenManagerInterface $jwtManager;

    public function __construct(JWTTokenManagerInterface $jwtManager)
    {
        $this->jwtManager = $jwtManager;
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        $jwt = $this->jwtManager->create($token->getUser());

        $response = new JsonResponse(['message' => 'Login successful']);

        // On ajoute le cookie JWT
        $response->headers->setCookie(
            Cookie::create('BEARER')
                ->withValue($jwt)
                ->withHttpOnly(true)
                ->withPath('/')
                ->withSecure(false) // ⚠️ passe à true en prod (HTTPS)
        );

        return $response;
    }
}
