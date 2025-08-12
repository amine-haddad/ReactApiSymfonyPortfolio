<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProfileSkillRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Metadata\ApiSubresource;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use Symfony\Component\Serializer\Annotation\MaxDepth;



#[ORM\Entity(repositoryClass: ProfileSkillRepository::class)]
#[ApiFilter(SearchFilter::class, properties: [
    'profile.id' => 'exact',
    'skill.name' => 'partial'
])]
//#[ApiResource(
//    normalizationContext: [
//        'groups' => ['read:ProfileSkills'],
//        'enable_max_depth' => true
//    ],
//    denormalizationContext: ['groups' => ['write:ProfileSkills']]
//)]
class ProfileSkill
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read:ProfileSkills'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'profileSkills')]
    #[Assert\NotNull]
    #[Groups(['read:ProfileSkills', 'write:ProfileSkills','read:Skill'])]
    #[MaxDepth(1)]
    private ?Profile $profile = null;

    #[ORM\ManyToOne(inversedBy: 'profileSkills')]
    #[Assert\NotNull]
    #[Groups(['read:ProfileSkills','write:ProfileSkills','read:Profile','read:Skill','read:User'])]
    #[ApiSubresource]
    #[MaxDepth(1)]
    private ?Skill $skill = null;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\Type('integer')]
    #[Assert\Range(min: 0, max: 100)]
    #[Groups(['read:ProfileSkills','write:ProfileSkills','read:Profile','read:User'])]
    private ?int $level = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProfile(): ?Profile
    {
        return $this->profile;
    }

    public function setProfile(?Profile $profile): static
    {
        $this->profile = $profile;

        return $this;
    }

    public function getSkill(): ?Skill
    {
        return $this->skill;
    }

    public function setSkill(?Skill $skill): static
    {
        $this->skill = $skill;

        return $this;
    }

    public function getLevel(): ?int
    {
        return $this->level;
    }

    public function setLevel(int $level): static
    {
        $this->level = $level;

        return $this;
    }
}
