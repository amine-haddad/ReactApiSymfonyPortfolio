<?php

namespace App\Service;

use Symfony\Component\String\Slugger\SluggerInterface;

class SluggerService
{
    private SluggerInterface $slugger;

    public function __construct(SluggerInterface $slugger)
    {
        $this->slugger = $slugger;
    }

    public function generateSlug(string $text): string
    {
        // Convertir le texte en minuscule
        $slug = $this->slugger->slug($text)->lower();

        // Remplacer les espaces par des tirets
        $slug = preg_replace('/\s+/', '-', $slug);

        // Retirer les caractères spéciaux ou non alphanumériques, sauf les tirets
        $slug = preg_replace('/[^a-z0-9-]/', '', $slug);

        // Éviter les tirets superflus en début ou fin de chaîne
        $slug = trim($slug, '-');

        return $slug;
    }
}
