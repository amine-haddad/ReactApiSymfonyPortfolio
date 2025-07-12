<?php
// src/Security/JwtCookieAuthenticator.php

namespace App\Security;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Encoder\JWTEncoderInterface;

class JwtCookieAuthenticator extends AbstractAuthenticator
{
    private JWTEncoderInterface $jwtEncoder;
    private UserProviderInterface $userProvider;

    public function __construct(JWTEncoderInterface $jwtEncoder, UserProviderInterface $userProvider)
    {
        $this->jwtEncoder = $jwtEncoder;
        $this->userProvider = $userProvider;
    }

    public function supports(Request $request): ?bool
    {
        return $request->cookies->has('BEARER');
    }

    public function authenticate(Request $request): SelfValidatingPassport
    {
        $jwt = $request->cookies->get('BEARER');

        if (!$jwt) {
            throw new AuthenticationException('No JWT token found in cookie.');
        }

        $payload = $this->jwtEncoder->decode($jwt);

        if (!$payload) {
            throw new AuthenticationException('Invalid JWT token.');
        }

        $username = $payload['username'] ?? $payload['email'] ?? null;

        if (!$username) {
            throw new AuthenticationException('JWT payload missing user identifier.');
        }

        return new SelfValidatingPassport(
            new UserBadge($username, fn ($userIdentifier) => $this->userProvider->loadUserByIdentifier($userIdentifier))
        );
    }

    public function onAuthenticationSuccess(Request $request, $token, string $firewallName): ?Response
    {
        return null; // Continuer la requête
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new Response('Authentication failed: ' . $exception->getMessage(), 401);
    }
}
