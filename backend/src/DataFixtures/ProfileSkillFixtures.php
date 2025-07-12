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
        // Charger toutes les compétences
        $skills = [];
        for ($i = 0; $i < 10; $i++) {
            $skills[] = $this->getReference(SkillFixtures::SKILL_REFERENCE . $i, Skill::class);
        }

        // Itérer sur tous les profils
        $profileIndex = 0;
        $skillReferenceIndex = 0;

        while (true) {
            $profileRef = ProfileFixtures::PROFILE_REFERENCE . $profileIndex;

            if (!$this->hasReference($profileRef,Profile::class)) {
                break;
            }

            /** @var Profile $profile */
            $profile = $this->getReference($profileRef, Profile::class);

            $usedSkillsKeys = [];

            // Affecter 4 à 7 compétences par profil
            $skillsCount = random_int(4, 7);
            for ($i = 0; $i < $skillsCount; $i++) {
                do {
                    $skillKey = array_rand($skills);
                } while (in_array($skillKey, $usedSkillsKeys, true));

                $usedSkillsKeys[] = $skillKey;
                $skill = $skills[$skillKey];

                $profileSkill = new ProfileSkill();
                $profileSkill->setLevel(random_int(50, 100))
                    ->setProfile($profile)
                    ->setSkill($skill);

                $manager->persist($profileSkill);
                $this->addReference(self::PROFILE_SKILL_REFERENCE . $skillReferenceIndex, $profileSkill);
                $skillReferenceIndex++;
            }

            $profileIndex++;
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
