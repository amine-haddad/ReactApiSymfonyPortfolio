<?php

namespace App\DataFixtures;

use App\Entity\Profile;
use App\Entity\Project;
use App\Entity\Skill;
use App\Service\SluggerService;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ProjectFixtures extends Fixture implements DependentFixtureInterface
{
    public const PROJECT_REFERENCE = 'project_';

    private SluggerService $slugger;

    public function __construct(SluggerService $slugger)
    {
        $this->slugger = $slugger;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();
        $projectIndex = 0;
        $profileIndex = 0;

        // Boucle tant qu'on trouve une référence de profil
        while (true) {
            $refKey = ProfileFixtures::PROFILE_REFERENCE . $profileIndex;

            if (!$this->hasReference($refKey,Profile::class)) {
                break;
            }

            /** @var Profile $profile */
            $profile = $this->getReference($refKey, Profile::class);

            // Créer 5 à 10 projets par profil
            $projectsPerProfile = random_int(5, 10);
            for ($j = 0; $j < $projectsPerProfile; $j++) {
                $project = new Project();
                $title = $faker->sentence(3);
                $description = $faker->realText(70, 2);
                $projectUrl = $faker->url();
                $slug = $this->slugger->generateSlug($title);

                $project->setTitle($title)
                    ->setDescription($description)
                    ->setProjectUrl($projectUrl)
                    ->setSlug($slug)
                    ->setProfile($profile);

                $this->addSkillsToProject($project);
                $this->addReference(self::PROJECT_REFERENCE . $projectIndex, $project);
                $manager->persist($project);

                $projectIndex++;
            }

            $profileIndex++;
        }

        $manager->flush();
    }

    private function addSkillsToProject(Project $project): void
{
    $numberOfTechnologies = random_int(1, 5);
    $usedSkillIndices = [];

    // Compter le nombre total de skills ajoutés dans SkillFixtures
    $totalSkills = 0;
    while ($this->hasReference(SkillFixtures::SKILL_REFERENCE . $totalSkills, Skill::class)) {
        $totalSkills++;
    }

    for ($j = 0; $j < $numberOfTechnologies; $j++) {
        do {
            $randomIndex = random_int(0, $totalSkills - 1);
        } while (in_array($randomIndex, $usedSkillIndices, true));

        $usedSkillIndices[] = $randomIndex;

        /** @var Skill $skill */
        $skill = $this->getReference(SkillFixtures::SKILL_REFERENCE . $randomIndex, Skill::class);
        $project->addTechnology($skill);
    }
}
    

    public function getDependencies(): array
    {
        return [
            SkillFixtures::class,
            ProfileFixtures::class,
        ];
    }
}
