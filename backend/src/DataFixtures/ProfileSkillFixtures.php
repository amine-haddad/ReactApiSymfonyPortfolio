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
        // Récupérer les profils spécifiques (admin ou contributeur)
        $profileAdmin = $this->getReference(ProfileFixtures::PROFILE_REFERENCE.'admin_0', Profile::class);  // Profil admin
        $profileContributor = $this->getReference(ProfileFixtures::PROFILE_REFERENCE.'contributor_0', Profile::class);  // Profil contributeur

        // Récupérer les compétences créées dans SkillFixtures
        $skills = [];
        for ($i = 1; $i <= 10; $i++) {
            $skills[] = $this->getReference(SkillFixtures::SKILL_REFERENCE . $i, Skill::class);
        }
        
        // Assigner des compétences pour l'admin
        for ($i = 1; $i <= 6; $i++) {
            $skill = $skills[array_rand($skills)];

            $profileSkill = new ProfileSkill();
            $profileSkill->setLevel(mt_rand(45, 100))
                ->setProfile($profileAdmin)  // Associer au profil admin
                ->setSkill($skill);

            $manager->persist($profileSkill);
            $this->addReference(self::PROFILE_SKILL_REFERENCE . $i, $profileSkill);
        }

        // Assigner des compétences pour le contributeur
        for ($i = 7; $i <= 12; $i++) {
            $skill = $skills[array_rand($skills)];

            $profileSkill = new ProfileSkill();
            $profileSkill->setLevel(mt_rand(45, 100))
                ->setProfile($profileContributor)  // Associer au profil contributeur
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
