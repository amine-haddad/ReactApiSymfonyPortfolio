<?php
namespace App\DataFixtures;

use App\Entity\Profile;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use App\Service\SluggerService;

class ProfileFixtures extends Fixture implements DependentFixtureInterface
{
    public const PROFILE_REFERENCE = 'profile_';
    private SluggerService $slugger;

    public function __construct(SluggerService $slugger)
    {
        $this->slugger = $slugger;
    }

    public function load(ObjectManager $manager): void
    {
        $user_admin = $this->getReference(UserFixtures::USER_ADMIN_REFERENCE, User::class); // Récupère l'admin
        $user_contributor = $this->getReference(UserFixtures::USER_CONTRIBUTOR_REFERENCE, User::class); // Récupère le contributeur
        $faker = Factory::create();

        // Crée plusieurs profils pour chaque utilisateur
        for ($i = 0; $i < 3; $i++) {
            $profileAdmin = new Profile();
            $profileAdmin->setName($faker->name())
                ->setTitle($faker->jobTitle())
                ->setBio($faker->text())
                ->setEmail($faker->unique()->safeEmail()) // Assurer l'unicité de l'email
                ->setGithubUrl($faker->url())
                ->setLinkedinUrl($faker->url())
                ->setSlug($this->slugger->generateSlug($profileAdmin->getName())) // Utilisation du service Slugger
                ->setUser($user_admin); // Associe l'admin au profil
            $manager->persist($profileAdmin);
            $this->addReference(self::PROFILE_REFERENCE.'admin_'.$i, $profileAdmin);
        }

        for ($i = 0; $i < 2; $i++) {
            $profileContributor = new Profile();
            $profileContributor->setName($faker->name())
                ->setTitle($faker->jobTitle())
                ->setBio($faker->text())
                ->setEmail($faker->unique()->safeEmail()) // Assurer l'unicité de l'email
                ->setGithubUrl($faker->url())
                ->setLinkedinUrl($faker->url())
                ->setSlug($this->slugger->generateSlug($profileContributor->getName())) // Utilisation du service Slugger
                ->setUser($user_contributor); // Associe le contributeur au profil
            $manager->persist($profileContributor);
            $this->addReference(self::PROFILE_REFERENCE.'contributor_'.$i, $profileContributor);
        }

        $manager->flush();
    }

    // Déclare les dépendances
    public function getDependencies(): array
    {
        return [
            UserFixtures::class, // Dépend de UserFixtures pour charger les utilisateurs d'abord
        ];
    }
}
