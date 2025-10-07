<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ImageRepository;
use DateTime;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use DateTimeImmutable;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
//#[ApiResource(
//    normalizationContext: [
//        'groups' => ['read:Image', 'read:Profile'],
//        'enable_max_depth' => true
//    ],
//    denormalizationContext: ['groups' => ['write:Image']]
//)]
#[Vich\Uploadable]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read:Image','read:User','read:Profile', 'read:Experience','read:Project','read:Skill'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['read:Image', 'write:Image','read:User','read:Profile', 'read:Experience','read:Project','read:Skill'])]
    private ?string $imageName = null;

    #[ORM\ManyToOne(inversedBy: 'images', cascade: ['persist', 'remove'])]
    #[Groups(['read:Image', 'write:Image'])]
    #[MaxDepth(1)]
    private ?Profile $profile = null;

    #[Vich\UploadableField(mapping: 'profile_file', fileNameProperty: 'imageName')]
    private ?File $profileFile = null;

    #[ORM\ManyToOne(inversedBy: 'images', cascade: ['persist', 'remove'])]
    #[Groups(['read:Image', 'write:Image','read:Project'])]
    #[MaxDepth(1)]
    private ?Project $project = null;

    #[Vich\UploadableField(mapping: 'project_file', fileNameProperty: 'imageName')]
    private ?File $projectFile = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[Groups(['read:Image', 'write:Image','read:Skill'])]
    #[MaxDepth(1)]
    private ?Skill $skills = null;

    #[Vich\UploadableField(mapping: 'skill_file', fileNameProperty: 'imageName')]
    private ?File $skillFile = null;

    #[ORM\ManyToOne(inversedBy: 'images', cascade: ['persist', 'remove'])]
    #[Groups(['read:Image', 'write:Image','read:Experience'])]
    #[MaxDepth(1)]
    private ?Experience $experiences = null;

    #[Vich\UploadableField(mapping: 'experience_file', fileNameProperty: 'imageName')]
    private ?File $experienceFile = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?DateTime $updated_at = null;

    #[ORM\ManyToOne(inversedBy: 'pictures', cascade: ['persist', 'remove'])]
    private ?ProfileSkill $profileSkill = null;

    #[Vich\UploadableField(mapping: 'profile_skill_file', fileNameProperty: 'imageName')]
    private ?File $profileSkillFile = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?DateTime $created_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    public function setImageName(?string $imageName): static
    {
        if (!$imageName || !is_string($imageName) || trim($imageName) === '') {
            $imageName = 'image_' . ($this->id ?? uniqid());
        }
        $this->imageName = $imageName;
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

    public function getProject(): ?Project
    {
        return $this->project;
    }

    public function setProject(?Project $project): static
    {
        $this->project = $project;
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

    // ==== FILES GETTERS/SETTERS + update updatedAt when a file changes ====

    public function getProfileFile(): ?File
    {
        return $this->profileFile;
    }

    public function setProfileFile(?File $file = null): static
    {
        $this->profileFile = $file;
        if ($file) {
            $this->updated_at = new DateTime();
        }
        return $this;
    }

    public function getProjectFile(): ?File
    {
        return $this->projectFile;
    }

    public function setProjectFile(?File $file = null): static
    {
        $this->projectFile = $file;
        if ($file) {
            $this->updated_at = new DateTime();
        }
        return $this;
    }

    public function getSkillFile(): ?File
    {
        return $this->skillFile;
    }

    public function setSkillFile(?File $file = null): static
    {
        $this->skillFile = $file;
        if ($file) {
            $this->updated_at = new DateTime();
        }
        return $this;
    }

    public function getExperienceFile(): ?File
    {
        return $this->experienceFile;
    }

    public function setExperienceFile(?File $file = null): static
    {
        $this->experienceFile = $file;
        if ($file) {
            $this->updated_at = new DateTime();
        }
        return $this;
    }

    public function getUpdatedAt(): ?DateTime
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(?DateTime $updated_at): static
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    public function getProfileSkill(): ?ProfileSkill
    {
        return $this->profileSkill;
    }

    public function setProfileSkill(?ProfileSkill $profileSkill): static
    {
        $this->profileSkill = $profileSkill;

        return $this;
    }

    /**
     * Get the value of profileSkillFile
     */ 
    public function getProfileSkillFile()
    {
        return $this->profileSkillFile;
    }

    /**
     * Set the value of profileSkillFile
     *
     * @return  self
     */ 
    public function setProfileSkillFile($profileSkillFile)
    {
        $this->profileSkillFile = $profileSkillFile;

        return $this;
    }

    public function getCreatedAt(): ?DateTime
    {
        return $this->created_at;
    }

    public function setCreatedAt(DateTime $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }
}
