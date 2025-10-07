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

        // Charger les références depuis les autres fixtures
        $this->loadReferences();

        // Images pour chaque profil (2 à 3)
        foreach ($this->profiles as $profile) {
            $this->createMultipleImages($manager, $faker, random_int(2, 3), $profile, null, null, null);
        }

        // Images pour chaque expérience (1 à 2)
        foreach ($this->experiences as $experience) {
            $this->createMultipleImages($manager, $faker, random_int(1, 2), null, null, null, $experience);
        }

        // Images pour chaque projet (1 à 4)
        foreach ($this->projects as $project) {
            $this->createMultipleImages($manager, $faker, random_int(1, 4), null, $project, null, null);
        }

        // Images pour chaque compétence (1 à 4)
        foreach ($this->skills as $skill) {
            $this->createMultipleImages($manager, $faker, random_int(1, 4), null, null, $skill, null);
        }

        $manager->flush();
    }

    private function loadReferences(): void
    {
        // Chargement des profils
        $i = 0;
        while ($this->hasReference(ProfileFixtures::PROFILE_REFERENCE . $i,Profile::class)) {
            $this->profiles[] = $this->getReference(ProfileFixtures::PROFILE_REFERENCE . $i,Profile::class);
            $i++;
        }

        // Expériences
        $i = 0;
        while ($this->hasReference(ExperienceFixtures::EXPERIENCE_REFERENCE . $i,Experience::class)) {
            $this->experiences[] = $this->getReference(ExperienceFixtures::EXPERIENCE_REFERENCE . $i,Experience::class);
            $i++;
        }

        // Projets
        $i = 0;
        while ($this->hasReference(ProjectFixtures::PROJECT_REFERENCE . $i,Project::class)) {
            $this->projects[] = $this->getReference(ProjectFixtures::PROJECT_REFERENCE . $i,Project::class);
            $i++;
        }

        // Compétences
        $i = 0;
        while ($this->hasReference(SkillFixtures::SKILL_REFERENCE . $i,Skill::class)) {
            $this->skills[] = $this->getReference(SkillFixtures::SKILL_REFERENCE . $i,Skill::class);
            $i++;
        }
    }

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

    private function createImage(
    ObjectManager $manager,
    $faker,
    ?Profile $profile,
    ?Project $project,
    ?Skill $skill,
    ?Experience $experience
): void {
    $image = new Image();

    // Génération d'une URL d'image valide et unique
    $imageUrl = "https://picsum.photos/seed/" . uniqid() . "/640/480.webp";

    $image->setImageName($imageUrl)
          ->setProfile($profile)
          ->setProject($project)
          ->setSkills($skill)
          ->setExperiences($experience)
          ->setCreatedAt(new \DateTime())
          ->setUpdatedAt(new \DateTime());

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
