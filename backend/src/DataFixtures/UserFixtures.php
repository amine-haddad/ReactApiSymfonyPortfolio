<?php

namespace App\DataFixtures;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Service\SluggerService;  // Import du service Slugger

class UserFixtures extends Fixture
{
    
    public const USER_ADMIN_REFERENCE = 'user_admin_';
    public const USER_CONTRIBUTOR_REFERENCE = 'user_contributor_';
    private SluggerService $slugger;  // Déclaration du service Slugger
    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        SluggerService $slugger 
    ) {
        $this->slugger = $slugger;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();
        // Création d’un utilisateur de type “contributeur” (= auteur)
        $contributor = new User();
        $contributor->setEmail('contributor@monsite.com');
        $contributor->setRoles(['ROLE_CONTRIBUTOR'])
                    ->setFirstName($faker->firstName)
                    ->setLastName($faker->lastName)
                    ->setSlug($this->slugger->generateSlug($contributor->getFirstName()));
                    
        $hashedPassword = $this->passwordHasher->hashPassword(
            $contributor,
            'contributorpassword'
        );

        $contributor->setPassword($hashedPassword);
        $manager->persist($contributor);
        $this->addReference(self::USER_CONTRIBUTOR_REFERENCE, $contributor);

        // Création d’un utilisateur de type “administrateur”
        $admin = new User();
        $admin->setEmail('admin@monsite.com');
        $admin->setRoles(['ROLE_ADMIN'])
        ->setFirstName($faker->firstName)
        ->setLastName($faker->lastName)
        ->setSlug($this->slugger->generateSlug($admin->getFirstName()));
        ;
        $hashedPassword = $this->passwordHasher->hashPassword(
            $admin,
            'adminpassword'
        );
        $admin->setPassword($hashedPassword);
        $manager->persist($admin);
        $this->addReference(self::USER_ADMIN_REFERENCE, $admin);

        // Sauvegarde des 2 nouveaux utilisateurs :
        $manager->flush();
    }
}