<?php
namespace App\DataFixtures;

use App\Entity\Skill;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class SkillFixtures extends Fixture
{
    public const SKILL_REFERENCE = 'skill_';
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        for ($i = 0; $i <= 10; $i++) {
            $skill = new Skill();
            $name  = $faker->word;
            $skill->setName($name)
                ->setUpdatedAt(new \DateTime())
                ->setSlug($name . '-' . (string) $i)
            ;
            $manager->persist($skill);
            $this->addReference(self::SKILL_REFERENCE . $i, $skill);
        }

        $manager->flush();
    }

}
