<?php
namespace App\DataFixtures;

use App\Entity\Profile;
use App\Entity\ProfileSkill;
use App\Entity\Skill;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;

class ProfileSkillFixtures extends Fixture implements DependentFixtureInterface
{
    public const PROFILE_SKILL_REFERENCE = 'profile_skill_';
    public function load(ObjectManager $manager): void
    {
        $profile = $this->getReference(ProfileFixtures::PROFILE_REFERENCE, Profile::class);
        for ($i = 1; $i <= 6; $i++) {

            $skill = $this->getReference(SkillFixtures::SKILL_REFERENCE . rand(1, 10), Skill::class);

            $profileSkill = new ProfileSkill();
            $profileSkill->setLevel(mt_rand(45, 100))
                ->setProfile($profile)
                ->setSkill($skill);

            $manager->persist($profileSkill);
            $this->addReference(self::PROFILE_SKILL_REFERENCE . $i, $profileSkill);

        }

        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            ProfileFixtures::class,
            SkillFixtures::class,
        ];
    }
}
