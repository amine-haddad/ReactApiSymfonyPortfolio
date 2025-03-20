<?php
// src/EventListener/SlugListener.php

// src/EventListener/SlugListener.php

namespace App\EventListener;

use App\Service\SluggerService;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;

class SlugListener
{
    private SluggerService $slugger;

    public function __construct(SluggerService $slugger)
    {
        $this->slugger = $slugger;
    }

    public function prePersist(PrePersistEventArgs $args): void
    {
        $this->generateSlug($args);
    }

    public function preUpdate(PreUpdateEventArgs $args): void
    {
        $this->generateSlug($args);
    }

    private function generateSlug($args): void
    {
        $entity = $args->getObject();

        if (method_exists($entity, 'getSlug')) {

            // Vérifier si le slug est vide avant de le générer
            if (!$entity->getSlug()) {
                
                // Prioriser le champ 'title', puis 'name', puis 'role'
                if (method_exists($entity, 'getTitle') && $entity->getTitle()) {
                    $slug = $this->slugger->generateSlug($entity->getTitle());
                } elseif (method_exists($entity, 'getName') && $entity->getName()) {
                    $slug = $this->slugger->generateSlug($entity->getName());
                } elseif (method_exists($entity, 'getRole') && $entity->getRole()) {
                    $slug = $this->slugger->generateSlug($entity->getRole());
                } else {
                    // Si aucun des champs n'est disponible, on ne génère pas de slug
                    return;
                }

                // On assigne le slug généré à l'entité
                $entity->setSlug($slug);
            }
        }
    }
}
