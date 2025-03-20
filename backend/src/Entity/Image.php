<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ImageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:Image']],
    denormalizationContext: ['groups' => ['write:Image']]
)]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read:Image', 'write:Image','read:Profile'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Image', 'write:Image','read:Profile'])]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[Groups(['read:Image', 'write:Image'])]
    private ?Profile $profile = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[Groups(['read:Image', 'write:Image'])]
    private ?Project $projects = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[Groups(['read:Image', 'write:Image'])]
    private ?Skill $skills = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[Groups(['read:Image', 'write:Image'])]
    
    private ?Experience $experiences = null;
    #[Groups(['read:Image', 'write:Image'])]

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
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

    public function getProjects(): ?Project
    {
        return $this->projects;
    }

    public function setProjects(?Project $projects): static
    {
        $this->projects = $projects;

        return $this;
    }

    public function getSkills(): ?Skill
    {
        return $this->skills;
    }

    public function setSkills(?Skill $skills): static
    {
        $this->skills = $skills;

        return $this;
    }

    public function getExperiences(): ?Experience
    {
        return $this->experiences;
    }

    public function setExperiences(?Experience $experiences): static
    {
        $this->experiences = $experiences;

        return $this;
    }
}
