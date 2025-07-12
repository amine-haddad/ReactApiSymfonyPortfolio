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
    $experienceIndex = 0;

    for ($i = 0; $i < 5; $i++) {
    $referenceName = ProfileFixtures::PROFILE_REFERENCE . $i;

    if (!$this->hasReference($referenceName, Profile::class)) {
        continue;
    }

    /** @var Profile $profile */
    $profile = $this->getReference($referenceName, Profile::class);

    $experienceCount = random_int(1, 4);

    for ($j = 0; $j < $experienceCount; $j++) {
        $startDate = $faker->dateTimeThisDecade();
        $endDate = $faker->dateTimeBetween($startDate, 'now');
        $title = $faker->jobTitle();

        $experience = new Experience();
        $experience->setProfile($profile)
            ->setRole($title)
            ->setCompagny($faker->company)
            ->setStartDate($startDate)
            ->setEndDate($endDate)
            ->setDescription($faker->sentence())
            ->setSlug($this->slugger->generateSlug($title));

        $manager->persist($experience);
        $this->addReference(self::EXPERIENCE_REFERENCE . $experienceIndex, $experience);
    $experienceIndex++;
    }
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
