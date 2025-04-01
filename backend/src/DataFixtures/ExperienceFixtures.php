<?php

namespace App\DataFixtures;

use App\Entity\Experience;
use App\Entity\Profile;
use App\Service\SluggerService;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ExperienceFixtures extends Fixture implements DependentFixtureInterface
{
    public const EXPERIENCE_REFERENCE = 'experience_';

    private SluggerService $slugger; // Déclarer la dépendance

    // Injecter le service dans le constructeur
    public function __construct(SluggerService $slugger)
    {
        $this->slugger = $slugger;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        // Récupérer les profils spécifiques (admin ou contributeur)
        $profileAdmin = $this->getReference(ProfileFixtures::PROFILE_REFERENCE.'admin_0', Profile::class);  // Profil admin
        $profileContributor = $this->getReference(ProfileFixtures::PROFILE_REFERENCE.'contributor_0', Profile::class);  // Profil contributeur
        
        // Ajouter des expériences pour l'admin
        for ($i = 0; $i < 4; $i++) { // On crée 4 expériences pour l'admin
            $startDate = $faker->dateTimeThisYear();
            $endDate = $faker->dateTimeBetween($startDate, 'now');
            $experience = new Experience();
            $experience->setProfile($profileAdmin)
                ->setRole($faker->jobTitle())
                ->setCompagny($faker->company)
                ->setStartDate($startDate)
                ->setEndDate($endDate)
                ->setDescription($faker->sentence())
                ->setSlug($this->slugger->generateSlug($faker->jobTitle()));

            $manager->persist($experience);
            $this->addReference(self::EXPERIENCE_REFERENCE.$i, $experience);
        }

        // Ajouter des expériences pour le contributeur
        for ($i = 4; $i < 8; $i++) { // On crée 4 expériences pour le contributeur
            $startDate = $faker->dateTimeThisYear();
            $endDate = $faker->dateTimeBetween($startDate, 'now');
            $experience = new Experience();
            $experience->setProfile($profileContributor)
                ->setRole($faker->jobTitle())
                ->setCompagny($faker->company)
                ->setStartDate($startDate)
                ->setEndDate($endDate)
                ->setDescription($faker->sentence())
                ->setSlug($this->slugger->generateSlug($faker->jobTitle()));

            $manager->persist($experience);
            $this->addReference(self::EXPERIENCE_REFERENCE.$i, $experience);
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ProfileFixtures::class, // Dépend de ProfileFixtures
        ];
    }
}
