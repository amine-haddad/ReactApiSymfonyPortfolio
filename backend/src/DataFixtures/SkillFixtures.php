<?php
namespace App\DataFixtures;

use App\Entity\Skill;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use App\Service\SluggerService; // Import du service Slugger

class SkillFixtures extends Fixture
{
    public const SKILL_REFERENCE = 'skill_';
    private SluggerService $slugger;

    // Injection du service Slugger dans le constructeur
    public function __construct(SluggerService $slugger)
    {
        $this->slugger = $slugger;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        for ($i = 0; $i <= 10; $i++) {
            $skill = new Skill();
            $name  = $faker->word;
            $slug = $this->slugger->generateSlug($name); // Utilisation du service Slugger pour générer le slug
            $skill->setName($name)
                ->setUpdatedAt(new \DateTime())
                ->setSlug($slug)
            ;
            $manager->persist($skill);
            $this->addReference(self::SKILL_REFERENCE . $i, $skill);
        }

        $manager->flush();
    }
}
