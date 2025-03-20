<?php

namespace App\EventSubscriber;

use App\Service\SluggerService;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class SlugSubscriber implements EventSubscriber
{
    private SluggerService $slugger;

    public function __construct(SluggerService $slugger)
    {
        $this->slugger = $slugger;
    }

    // Méthode qui retourne les événements que ce Subscriber écoute
    public function getSubscribedEvents(): array
    {
        return [Events::prePersist, Events::preUpdate];
    }

    // Méthode qui s'exécute avant la persistance d'une entité
    public function prePersist(LifecycleEventArgs $args): void
    {
        $this->handleEvent($args->getObject());
    }

    // Méthode qui s'exécute avant la mise à jour d'une entité
    public function preUpdate(LifecycleEventArgs $args): void
    {
        $this->handleEvent($args->getObject());
    }

    // Fonction qui traite l'entité, et gère la création du slug
    private function handleEvent(object $entity): void
    {
        // Vérifie si l'entité a bien la méthode `getSlug`
        if (!method_exists($entity, 'getSlug')) {
            return;
        }

        // Cas où l'entité a une propriété 'name' (par exemple, une entité "Skill")
        if (method_exists($entity, 'getName') && $entity->getName()) {
            $slug = $this->slugger->generateSlug($entity->getName());
            $entity->setSlug($slug);
        }
        // Cas où l'entité a une propriété 'title' (par exemple, une entité "Article")
        elseif (method_exists($entity, 'getTitle') && $entity->getTitle()) {
            $slug = $this->slugger->generateSlug($entity->getTitle());
            $entity->setSlug($slug);
        }
        // Cas où l'entité a une propriété 'role' (par exemple, une entité "User")
        elseif (method_exists($entity, 'getRole') && $entity->getRole()) {
            $slug = $this->slugger->generateSlug($entity->getRole());
            $entity->setSlug($slug);
        }
        // Cas par défaut : si aucune condition n'est remplie, on ne génère pas de slug
        // ou tu peux définir un slug par défaut si nécessaire
        else {
            $entity->setSlug('default-slug');
        }
    }
}
