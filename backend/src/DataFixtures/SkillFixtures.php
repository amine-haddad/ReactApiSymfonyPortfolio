<?php

namespace App\DataFixtures;

use App\Entity\Skill;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Service\SluggerService;

class SkillFixtures extends Fixture
{
    public const SKILL_REFERENCE = 'skill_';

    public function __construct(private readonly SluggerService $slugger)
    {
    }

    public function load(ObjectManager $manager): void
    {
        $skills = [
            'HTML',
            'CSS',
            'JavaScript',
            'TypeScript',
            'PHP',
            'Python',
            'SQL',
            'Symfony',
            'Laravel',
            'React',
            'Vite + React',
            'Node.js',
            'Express.js',
            'Bootstrap',
            'Tailwind CSS',
            'Docker',
            'Git',
            'GitHub',
            'PostgreSQL',
            'MySQL',
            'MongoDB',
            'API REST',
            'Postman',
            'Linux',
            'Debian',
            'Nginx',
            'Apache',
            'Raspberry Pi',
            'Figma',
            'VS Code',
            'Composer',
            'NPM',
            'Yarn',
            'Mercure',
        ];

        $now = new \DateTimeImmutable();

        foreach ($skills as $index => $name) {
            $skill = new Skill();
            $slug = $this->slugger->generateSlug($name);

            $skill->setName($name)
                ->setSlug($slug)
                ->setUpdatedAt($now)
                ->setCreatedAt($now); // Si le champ existe

            $manager->persist($skill);
            $this->addReference(self::SKILL_REFERENCE . $index, $skill);
        }

        $manager->flush();
    }
}
