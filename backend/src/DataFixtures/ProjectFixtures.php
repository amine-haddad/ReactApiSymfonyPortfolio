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
        
            $project->setTitle($title)
                ->setDescription($decription)
                ->setProjectUrl($projectUrl)
                ->setSlug($title . '-' .  uniqid())
                ->setProfile($profile)
                ;
                $numberOfTechnologies = rand(1, 5);
                $usedSkills = [];
                for ($j = 0; $j < $numberOfTechnologies; $j++) {
                    $randomSkillIndex = rand(1, 10);
                    if (!in_array($randomSkillIndex, $usedSkills)) {
                        $usedSkills[] = $randomSkillIndex;
                        $skill = $this->getReference(SkillFixtures::SKILL_REFERENCE . $randomSkillIndex, Skill::class);
                        $project->addTechnologies($skill);
                    } else {
                        // Si compétence déjà utilisée, recommencer
                        $j--;
                    }
                }
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
