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

    public function getSubscribedEvents(): array
    {
        return [Events::prePersist, Events::preUpdate];
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        $this->handleEvent($args->getObject(), $args->getObjectManager());
    }

    public function preUpdate(LifecycleEventArgs $args): void
    {
        $this->handleEvent($args->getObject(), $args->getObjectManager());
        $meta = $args->getObjectManager()->getClassMetadata(get_class($args->getObject()));
        $args->getObjectManager()->getUnitOfWork()->recomputeSingleEntityChangeSet($meta, $args->getObject());
    }

    private function handleEvent(object $entity, $em): void
    {
        dump('SlugSubscriber called for', get_class($entity));

        if (!method_exists($entity, 'getSlug') || $entity->getSlug()) {
            return;
        }

        // Détermine la base du slug selon les propriétés disponibles
        $base = null;
        if (method_exists($entity, 'getTitle') && $entity->getTitle()) {
            $base = $entity->getTitle();
        } elseif (method_exists($entity, 'getName') && $entity->getName()) {
            $base = $entity->getName();
        } elseif (
            method_exists($entity, 'getFirstName') && $entity->getFirstName() &&
            method_exists($entity, 'getLastName') && $entity->getLastName()
        ) {
            $base = $entity->getFirstName() . ' ' . $entity->getLastName();
        } elseif (method_exists($entity, 'getRole') && $entity->getRole()) {
            $base = $entity->getRole();
        }

        if (!$base) {
            return;
        }

        $baseSlug = $this->slugger->generateSlug($base);
        $slug = $baseSlug;
        $i = 1;
        $repo = $em->getRepository(get_class($entity));

        while (
            ($existing = $repo->findOneBy(['slug' => $slug])) &&
            ($entity->getId() === null || $existing->getId() !== $entity->getId())
        ) {
            $slug = $baseSlug . '-' . $i;
            $i++;
        }

        $entity->setSlug($slug);
    }
}
