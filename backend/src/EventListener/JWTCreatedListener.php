<?php

// src/Security/JWTCreatedEventListener.php

namespace App\EventListener;

use App\Entity\User;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;

#[AsEventListener(event: 'lexik_jwt_authentication.on_jwt_created', method: 'onJWTCreated')]
class JWTCreatedListener
{
    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        $user = $event->getUser();

        if (!$user instanceof User) {
            error_log("JWT Listener: Pas d'utilisateur trouvé.");
            return;
        }
        error_log("JWT Listener: Utilisateur ID -> " . $user->getId());

        // Ajouter l'ID de l'utilisateur dans le token
        $payload = $event->getData();
        $payload['id'] = $user->getId();

        $event->setData($payload);
    }
}
