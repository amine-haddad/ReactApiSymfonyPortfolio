<?php

namespace App\Controller;

use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\Request;

class AuthController extends AbstractController
{
    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $cookie = Cookie::create('BEARER')
            ->withValue('')
            ->withExpires(new \DateTime('-1 hour'))
            ->withPath('/')
            ->withHttpOnly(true)
            ->withSecure($request->isSecure())
            ->withSameSite('lax');

        return new JsonResponse(null, 204, ['Set-Cookie' => (string) $cookie]);
    }
}
