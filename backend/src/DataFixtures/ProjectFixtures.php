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

        // Récupération des profils admin et contributeur
        $profileAdmin = $this->getReference(ProfileFixtures::PROFILE_REFERENCE.'admin_0', Profile::class);  // Profil admin
        $profileContributor = $this->getReference(ProfileFixtures::PROFILE_REFERENCE.'contributor_0', Profile::class);  // Profil contributeur

        // Créer des projets pour l'admin
        for ($i = 0; $i < 10; $i++) {
            $project = new Project();
            $title = $faker->sentences(3, true);
            $description = $faker->realText(70, 2);
            $projectUrl = $faker->url();
            $slug = $this->slugger->generateSlug($title);

            $project->setTitle($title)
                ->setDescription($description)
                ->setProjectUrl($projectUrl)
                ->setSlug($slug)
                ->setProfile($profileAdmin);  // Associer le profil admin

            // Ajouter des technologies au projet
            $this->addSkillsToProject($project);

            $this->addReference(self::PROJECT_REFERENCE.'admin_'.$i, $project);
            $manager->persist($project);
        }

        // Créer des projets pour le contributeur
        for ($i = 0; $i < 10; $i++) {
            $project = new Project();
            $title = $faker->sentences(3, true);
            $description = $faker->realText(70, 2);
            $projectUrl = $faker->url();
            $slug = $this->slugger->generateSlug($title);

            $project->setTitle($title)
                ->setDescription($description)
                ->setProjectUrl($projectUrl)
                ->setSlug($slug)
                ->setProfile($profileContributor);  // Associer le profil contributeur

            // Ajouter des technologies au projet
            $this->addSkillsToProject($project);

            $this->addReference(self::PROJECT_REFERENCE.'contributor_'.$i, $project);
            $manager->persist($project);
        }

        $manager->flush();
    }

    // Fonction pour ajouter des compétences au projet
    private function addSkillsToProject(Project $project)
    {
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
    }

    public function getDependencies(): array
    {
        return [
            SkillFixtures::class,  // Assure-toi que les compétences sont chargées avant les projets
            ProfileFixtures::class, // Assure-toi que les profils sont chargés avant les projets
        ];
    }
}
