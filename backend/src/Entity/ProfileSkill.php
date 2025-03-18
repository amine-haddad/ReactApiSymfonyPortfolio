<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProfileSkillRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProfileSkillRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:ProfileSkills']],
    denormalizationContext: ['groups' => ['write:ProfileSkills']]
)]
class ProfileSkill
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'profileSkills')]
    #[Groups(['read:ProfileSkills', 'write:ProfileSkills',"read:Profile"])]
    private ?Profile $profile = null;
    #[Groups(['read:ProfileSkills','write:ProfileSkills',"read:Profile"])]
    #[ORM\ManyToOne(inversedBy: 'profileSkills')]
    private ?Skill $skill = null;

    #[ORM\Column]
    #[Groups(['read:ProfileSkills','write:ProfileSkills',"read:Profile"])]
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
