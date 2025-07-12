<?php

namespace App\EventListener;

use App\Entity\User;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

#[AsEventListener(event: 'lexik_jwt_authentication.on_jwt_created', method: 'onJWTCreated')]
class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        $user = $event->getUser();

        if (!$user instanceof User) {
            error_log("JWT Listener: Mauvais type -> " . get_class($user));
            return;
        }

        try {
            error_log("JWT Listener: Utilisateur ID -> " . $user->getId());

            $payload = $event->getData();
            $payload['id'] = $user->getId();
            $payload['email'] = $user->getEmail();
            $payload['roles'] = $user->getRoles();

            $event->setData($payload);
        } catch (\Throwable $e) {
            error_log('Erreur dans JWTCreatedListener : ' . $e->getMessage());
        }
    }
}
