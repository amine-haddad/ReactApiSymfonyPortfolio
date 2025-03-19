<?php

namespace App\DataFixtures;

use App\Entity\Profile;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class ProfileFixtures extends Fixture 
{
    public const PROFILE_REFERENCE = 'profile_1';
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();
        
        $profile = new Profile();
        $githubUrl = $faker->url();
        $linkedinUrl = $faker->url();
        $title =$faker->jobTitle();
        $name =$faker->word();
        $profile->setName($name)
                ->setTitle($title)
                ->setBio($faker->text())
                ->setEmail($faker->email())
                ->setGithubUrl($githubUrl)
                ->setLinkedinUrl($linkedinUrl)
                ->setSlug(slug: $name.'-'.$title);  
                $manager->persist($profile);
                $this->addReference(self::PROFILE_REFERENCE , $profile);
                $manager->flush();
    }

}
