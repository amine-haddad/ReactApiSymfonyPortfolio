<?php
// src/Security/AuthenticationSuccessHandler.php
// Après login réussi, récupère le token 
// et le place dans un cookie HttpOnly BEARER

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Event\AuthenticationSuccessEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Cookie;

class AuthenticationSuccessHandler implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            'lexik_jwt_authentication.on_authentication_success' => 'onAuthenticationSuccess',
        ];
    }

    public function onAuthenticationSuccess(AuthenticationSuccessEvent $event): void
    {
        error_log('AuthenticationSuccessHandler called');
        $data = $event->getData();
        $response = $event->getResponse();

        if (!isset($data['token'])) {
            return;
        }

        $token = $data['token'];

        $cookie = Cookie::create('BEARER')
            ->withValue($token)
            ->withHttpOnly(true)
            ->withSecure($_ENV['APP_ENV'] === 'prod') // auto switch dev/prod
            ->withPath('/')
            ->withSameSite('Lax')
            ->withExpires(time() + 3600);

        $response->headers->setCookie($cookie);

        // Supprime le token du body JSON pour ne pas l'exposer
        unset($data['token']);
        $event->setData($data);
    }
}