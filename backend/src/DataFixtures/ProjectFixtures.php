<?php
namespace App\DataFixtures;

use App\Entity\Profile;
use App\Entity\Project;
use App\Entity\Skill;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ProjectFixtures extends Fixture implements DependentFixtureInterface
{
    public const PROJECT_REFERENCE = 'project_';
    public function load(ObjectManager $manager): void
    {
        // $product = new Product();
        // $manager->persist($product);
         // Récupération du profil existant
         $faker = Factory::create();
         $profile = $this->getReference(ProfileFixtures::PROFILE_REFERENCE, Profile::class);
        for ($i = 0; $i < 8; $i++) {
            # code...
            $project    = new Project();
            $title      = $faker->sentences(3, true);
            $decription = $faker->realText(70,2);
            $projectUrl = $faker->url;
            //$randomSkillIndex = rand(0, 9);
            $skill = $this->getReference(SkillFixtures::SKILL_REFERENCE.rand(1, 10), Skill::class);
            
            //$imageUrl   = $faker->imageUrl;
            $project->setTitle($title)
                ->setDescription($decription)
                ->setProjectUrl($projectUrl)
                ->setSlug($title . '-' .  uniqid())
                ->addTechnologies($skill)
                ->setProfile($profile)
                ;

                $this->addReference(self::PROJECT_REFERENCE.$i, $project);
                $manager->persist($project);
            }
            $manager->flush();

    }

    public function getDependencies(): array
    {
        return [
            //ProfileFixtures::class,
            SkillFixtures::class,
        ];
    }
}
