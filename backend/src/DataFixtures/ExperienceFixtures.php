<?php

namespace App\DataFixtures;

use App\Entity\Experience;
use App\Entity\Profile;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ExperienceFixtures extends Fixture implements DependentFixtureInterface
{
    public const EXPERIENCE_REFERENCE = 'experience_';
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();
        
        $profile = $this->getReference(ProfileFixtures::PROFILE_REFERENCE, Profile::class);
        
        for ($i=0; $i < 8 ; $i++) { 
            # code...
            $startDate = $faker->dateTimeThisYear();
            $endDate = $faker->dateTimeBetween($startDate, 'now');
            $experience = new Experience();
            $experience->setProfile($profile)
                        ->setRole($faker->jobTitle())
                        ->setCompagny($faker->company)
                        ->setStartDate($startDate)
                        ->setEndDate($endDate)
                        ->setDescription($faker->sentence())
                        ->setSlug($faker->slug());
            
            $manager->persist($experience);
            $this->addReference(self::EXPERIENCE_REFERENCE.$i,$experience);
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
