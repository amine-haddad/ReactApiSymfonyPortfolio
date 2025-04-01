<?php

namespace App\DataFixtures;

use App\Entity\Experience;
use App\Entity\Image;
use App\Entity\Profile;
use App\Entity\Project;
use App\Entity\Skill;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ImageFixtures extends Fixture implements DependentFixtureInterface
{
    private array $profiles = [];
    private array $experiences = [];
    private array $projects = [];
    private array $skills = [];

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        // Récupérer toutes les références enregistrées dans les autres fixtures
        $this->loadReferences();

        // Ajouter des images pour chaque profil (2 à 3 images)
        foreach ($this->profiles as $profile) {
            $this->createMultipleImages($manager, $faker, random_int(2, 3), $profile, null, null, null);
        }

        // Ajouter des images pour chaque expérience (1 à 2 images)
        foreach ($this->experiences as $experience) {
            $this->createMultipleImages($manager, $faker, random_int(1, 2), null, null, null, $experience);
        }

        // Ajouter des images pour chaque projet (1 à 4 images)
        foreach ($this->projects as $project) {
            $this->createMultipleImages($manager, $faker, random_int(1, 4), null, $project, null, null);
        }

        // Ajouter des images pour chaque compétence (1 à 4 images)
        foreach ($this->skills as $skill) {
            $this->createMultipleImages($manager, $faker, random_int(1, 4), null, null, $skill, null);
        }

        $manager->flush();
    }

    /**
     * Charge les références créées dans les autres fixtures
     */
    private function loadReferences(): void
    {
        // Récupérer les profils (admin & contributeurs)
        for ($i = 0; $i < 2; $i++) { 
            $this->profiles[] = $this->getReference(ProfileFixtures::PROFILE_REFERENCE . "admin_$i", Profile::class);
            $this->profiles[] = $this->getReference(ProfileFixtures::PROFILE_REFERENCE . "contributor_$i", Profile::class);
        }

        // Récupérer les expériences
        for ($i = 0; $i < 8; $i++) {
            $this->experiences[] = $this->getReference(ExperienceFixtures::EXPERIENCE_REFERENCE . $i, class: Experience::class);
        }

        // Récupérer les projets
        for ($i = 0; $i < 8; $i++) {
            $this->projects[] = $this->getReference(ProjectFixtures::PROJECT_REFERENCE . "admin_$i", Project::class);
            $this->projects[] = $this->getReference(ProjectFixtures::PROJECT_REFERENCE . "contributor_$i", Project::class);
        }

        // Récupérer les compétences
        for ($i = 0; $i < 8; $i++) {
            $this->skills[] = $this->getReference(SkillFixtures::SKILL_REFERENCE . $i, Skill::class);
        }
    }

    /**
     * Crée plusieurs images pour une entité donnée.
     */
    private function createMultipleImages(
        ObjectManager $manager,
        $faker,
        int $count,
        ?Profile $profile,
        ?Project $project,
        ?Skill $skill,
        ?Experience $experience
    ): void {
        for ($i = 0; $i < $count; $i++) {
            $this->createImage($manager, $faker, $profile, $project, $skill, $experience);
        }
    }

    /**
     * Crée une seule image.
     */
    private function createImage(
        ObjectManager $manager,
        $faker,
        ?Profile $profile,
        ?Project $project,
        ?Skill $skill,
        ?Experience $experience
    ): void {
        $image = new Image();
        
        $image->setName($faker->imageUrl(640, 480, 'nature', true))
              ->setProfile($profile)
              ->setProjects($project)
              ->setSkills($skill)
              ->setExperiences($experience);

        $manager->persist($image);
    }

    public function getDependencies(): array
    {
        return [
            ProfileFixtures::class,
            ExperienceFixtures::class,
            ProjectFixtures::class,
            SkillFixtures::class,
        ];
    }
}
