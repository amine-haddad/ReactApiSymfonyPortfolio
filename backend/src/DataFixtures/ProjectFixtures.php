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
            if (!$this->hasReference($refKey, Profile::class)) {
                break;
            }
            /** @var Profile $profile */
            $profile = $this->getReference($refKey, Profile::class);

            // Récupérer les skills connus du profil (via ProfileSkill)
            $profileSkills = $profile->getProfileSkills();
            $skills = [];
            foreach ($profileSkills as $profileSkill) {
                $skills[] = $profileSkill->getSkill();
            }
            $totalSkills = count($skills);
            if ($totalSkills === 0) {
                $profileIndex++;
                continue; // Aucun skill connu, on ne crée pas de projet
            }

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

                // Ajoute des skills connus du profil au projet
                $numberOfTechnologies = random_int(1, min(5, $totalSkills));
                $usedSkillIndices = [];
                for ($k = 0; $k < $numberOfTechnologies; $k++) {
                    do {
                        $randomIndex = random_int(0, $totalSkills - 1);
                    } while (in_array($randomIndex, $usedSkillIndices, true));
                    $usedSkillIndices[] = $randomIndex;
                    /** @var Skill $skill */
                    $skill = $skills[$randomIndex];
                    $project->addTechnology($skill);
                }

                $this->addReference(self::PROJECT_REFERENCE . $projectIndex, $project);
                $manager->persist($project);
                $projectIndex++;
            }
            $profileIndex++;
        }

        $manager->flush();
    }


    

    public function getDependencies(): array
    {
        return [
            SkillFixtures::class,
            ProfileFixtures::class,
            ProfileSkillFixtures::class,
        ];
    }
}
