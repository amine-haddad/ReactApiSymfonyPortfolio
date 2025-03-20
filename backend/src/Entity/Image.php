<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ImageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Attribute\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:Image']],
    denormalizationContext: ['groups' => ['write:Image']]
)]
#[Vich\Uploadable]
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

    #[ORM\ManyToOne(inversedBy: 'images', cascade: ['persist', 'remove'])]
    #[Groups(['read:Image', 'write:Image'])]
    private ?Profile $profile = null;

    // On va créer un nouvel attribut à notre entité, qui ne sera pas lié à une colonne

   // Tu peux d’ailleurs voir que l’attribut ORM column n’est pas spécifié car

   // On ne rajoute pas de données de type file en bdd

   #[Vich\UploadableField(mapping: 'profile_file', fileNameProperty: 'name')]

   private ?File $profileFile = null;



    #[ORM\ManyToOne(inversedBy: 'images', cascade: ['persist', 'remove'])]
    #[Groups(['read:Image', 'write:Image'])]
    private ?Project $projects = null;

    #[Vich\UploadableField(mapping: 'project_file', fileNameProperty: 'name')]
    private ?File $projectFile = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[Groups(['read:Image', 'write:Image'])]
    private ?Skill $skills = null;

    #[Vich\UploadableField(mapping: 'skill_file', fileNameProperty: 'name')]
    private ?File $skillFile = null;

    #[ORM\ManyToOne(inversedBy: 'images', cascade: ['persist', 'remove'])]
    #[Groups(['read:Image', 'write:Image'])] 
    private ?Experience $experiences = null;

    #[Vich\UploadableField(mapping: 'experience_file', fileNameProperty: 'name')]
    private ?File $experienceFile = null;


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

   /**
    * Get the value of profileFile
    */ 
   public function getProfileFile()
   {
      return $this->profileFile;
   }

   /**
    * Set the value of profileFile
    *
    * @return  self
    */ 
   public function setProfileFile(File $image = null)
   {
      $this->profileFile = $image;

      return $this;
   }

    /**
     * Get the value of projectFile
     */ 
    public function getProjectFile()
    {
        return $this->projectFile;
    }

    /**
     * Set the value of projectFile
     *
     * @return  self
     */ 
    public function setProjectFile(File $image = null)
    {
        $this->projectFile = $image;

        return $this;
    }

    /**
     * Get the value of skillFile
     */ 
    public function getSkillFile()
    {
        return $this->skillFile;
    }

    /**
     * Set the value of skillFile
     *
     * @return  self
     */ 
    public function setSkillFile(File $image = null)
    {
        $this->skillFile = $image;

        return $this;
    }

    /**
     * Get the value of experienceFile
     */ 
    public function getExperienceFile()
    {
        return $this->experienceFile;
    }

    /**
     * Set the value of experienceFile
     *
     * @return  self
     */ 
    public function setExperienceFile(File $image = null)
    {
        $this->experienceFile = $image;

        return $this;
    }
}
