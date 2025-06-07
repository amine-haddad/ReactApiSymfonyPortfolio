<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SkillRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: SkillRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:Skill']],
    denormalizationContext: ['groups' => ['write:Skill']]
)]
#[ORM\HasLifecycleCallbacks]
class Skill
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read:Skill','project:read', 'write:Skill',"read:Profile",'read:Project','read:ProfileSkills','read:User'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Skill', 'write:Skill','project:read',"read:Profile",'read:Project','read:ProfileSkills','read:User'])]
    #[Assert\NotBlank(message: "Skill cannot be blank")]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable:true)]
    #[Groups(['read:Skill',"read:Profile",'read:Project','project:read'])]
    private ?string $slug = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $updated_at = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $created_at = null;

    /**
     * @var Collection<int, Project>
     */
    #[ORM\ManyToMany(targetEntity: Project::class, mappedBy: 'technologies', cascade: ['persist', 'remove'])]
    #[Groups(['read:Skill'])]
    private Collection $projects;


    /**
     * @var Collection<int, Image>
     */
    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'skills', cascade: ['persist', 'remove'])]
    #[Groups(['read:Skill',"read:Profile",'read:Project','project:read'])]
    private Collection $images;

    /**
     * @var Collection<int, ProfileSkill>
     */
    #[ORM\OneToMany(targetEntity: ProfileSkill::class, mappedBy: 'skill', cascade: ['persist', 'remove'])]
    #[Groups(['read:Skill', 'write:Skill'])]
    private Collection $profileSkills;

    public function __construct()
    {
        $this->created_at = new \DateTime();
        $this->updated_at = new \DateTime();
        $this->projects = new ArrayCollection();
        $this->images = new ArrayCollection();
        $this->profileSkills = new ArrayCollection();
    }

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

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(?\DateTimeInterface $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    /**
     * @return Collection<int, Project>
     */
    public function getProjects(): Collection
    {
        return $this->projects;
    }

    public function addProject(Project $project): static
    {
        if (!$this->projects->contains($project)) {
            $this->projects->add($project);
            $project->addTechnologies($this);
        }

        return $this;
    }

    public function removeProject(Project $project): static
    {
        if ($this->projects->removeElement($project)) {
            $project->removeTechnologies($this);
        }

        return $this;
    }


    /**
     * @return Collection<int, Image>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Image $image): static
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setSkills($this);
        }

        return $this;
    }

    public function removeImage(Image $image): static
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getSkills() === $this) {
                $image->setSkills(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, ProfileSkill>
     */
    public function getProfileSkills(): Collection
    {
        return $this->profileSkills;
    }

    public function addProfileSkill(ProfileSkill $profileSkill): static
    {
        if (!$this->profileSkills->contains($profileSkill)) {
            $this->profileSkills->add($profileSkill);
            $profileSkill->setSkill($this);
        }

        return $this;
    }

    public function removeProfileSkill(ProfileSkill $profileSkill): static
    {
        if ($this->profileSkills->removeElement($profileSkill)) {
            // set the owning side to null (unless already changed)
            if ($profileSkill->getSkill() === $this) {
                $profileSkill->setSkill(null);
            }
        }

        return $this;
    }
}
