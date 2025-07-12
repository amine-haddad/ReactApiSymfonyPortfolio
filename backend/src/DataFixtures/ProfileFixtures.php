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
        $faker = Factory::create();

        // On boucle sur les deux utilisateurs créés dans UserFixtures
        $userReferences = [
            UserFixtures::USER_ADMIN_REFERENCE . '0',
            UserFixtures::USER_CONTRIBUTOR_REFERENCE . '0',
        ];

        $profileIndex = 0;

        foreach ($userReferences as $refKey) {
            /** @var User $user */
            $user = $this->getReference($refKey,User::class,);
            $profileCount = random_int(1, 3); // chaque user aura 1 à 3 profils

            for ($i = 0; $i < $profileCount; $i++) {
                $profile = new Profile();
                $profile->setName($faker->name())
                    ->setTitle($faker->jobTitle())
                    ->setBio($faker->text(200))
                    ->setEmail($faker->unique()->safeEmail())
                    ->setGithubUrl($faker->url())
                    ->setLinkedinUrl($faker->url());

                $slug = $this->slugger->generateSlug($profile->getName()) . "-$profileIndex";
                $profile->setSlug($slug);
                $profile->setUser($user);

                $manager->persist($profile);
                $this->addReference(self::PROFILE_REFERENCE . $profileIndex, $profile);
                $profileIndex++;
            }
        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class,
        ];
    }
}
