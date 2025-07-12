<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Service\SluggerService;

class UserFixtures extends Fixture
{
    public const USER_ADMIN_REFERENCE = 'user_admin_';
    public const USER_CONTRIBUTOR_REFERENCE = 'user_contributor_';

    private SluggerService $slugger;

    public function __construct(
        private readonly UserPasswordHasherInterface $passwordHasher,
        SluggerService $slugger
    ) {
        $this->slugger = $slugger;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        // Contributor
        $contributor = new User();
        $contributor->setEmail('contributor@monsite.com')
            ->setRoles(['ROLE_CONTRIBUTOR'])
            ->setFirstName($faker->firstName)
            ->setLastName($faker->lastName);

        $slugContributor = $this->slugger->generateSlug(
            strtolower($contributor->getFirstName() . '-' . $contributor->getLastName())
        );
        $contributor->setSlug($slugContributor);

        $contributor->setPassword(
            $this->passwordHasher->hashPassword($contributor, 'contributorpassword')
        );

        $manager->persist($contributor);
        $this->addReference(self::USER_CONTRIBUTOR_REFERENCE . '0', $contributor);

        // Admin
        $admin = new User();
        $admin->setEmail('admin@monsite.com')
            ->setRoles(['ROLE_ADMIN'])
            ->setFirstName($faker->firstName)
            ->setLastName($faker->lastName);

        $slugAdmin = $this->slugger->generateSlug(
            strtolower($admin->getFirstName() . '-' . $admin->getLastName())
        );
        $admin->setSlug($slugAdmin);

        $admin->setPassword(
            $this->passwordHasher->hashPassword($admin, 'adminpassword')
        );

        $manager->persist($admin);
        $this->addReference(self::USER_ADMIN_REFERENCE . '0', $admin);

        $manager->flush();
    }
}
