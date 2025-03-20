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
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        // Ajout d'une image pour un profil
        $profile = $this->getReference(ProfileFixtures::PROFILE_REFERENCE,Profile::class);
        $this->createImage($manager, $faker, $profile, null, null, null);

        // Ajout d'images pour les expériences
        for ($i = 0; $i < 8; $i++) {
            $experience = $this->getReference(ExperienceFixtures::EXPERIENCE_REFERENCE . $i,Experience::class);
            $this->createImage($manager, $faker, null, null, null, $experience);
        }

        // Ajout d'images pour les projets
        for ($i = 0; $i < 8; $i++) {
            $project = $this->getReference(ProjectFixtures::PROJECT_REFERENCE . $i,Project::class);
            $this->createImage($manager, $faker, null, $project, null, null);
        }

        // Ajout d'images pour les compétences
        for ($i = 0; $i < 8; $i++) {
            $skill = $this->getReference(SkillFixtures::SKILL_REFERENCE . $i,Skill::class);
            $this->createImage($manager, $faker, null, null, $skill, null);
        }


        $manager->flush();
    }

    private function createImage(
        ObjectManager $manager,
         $faker,
          ?Profile $profile,
          ?Project $project,
          ?Skill $skill,
          ?Experience $experience
          ): void
    {
        $image = new Image();
        $image->setName($faker->imageUrl(640, 480, 'business', true)) // Génère une URL d'image
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
