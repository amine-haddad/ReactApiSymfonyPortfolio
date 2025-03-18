<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProfileRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: ProfileRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:Profile']],
    denormalizationContext: ['groups' => ['write:Profile']]
)]
class Profile
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Profile', 'write:Profile'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Profile', 'write:Profile'])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['read:Profile', 'write:Profile'])]
    private ?string $bio = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Profile', 'write:Profile'])]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['read:Profile', 'write:Profile'])]
    private ?string $github_url = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['read:Profile', 'write:Profile'])]
    private ?string $linkedin_url = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Profile', 'write:Profile'])]
    private ?string $slug = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTimeInterface $updated_at = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $created_at = null;

    /**
     * @var Collection<int, Project>
     */
    #[ORM\OneToMany(targetEntity: Project::class, mappedBy: 'profile')]
    #[Groups(['read:Profile'])]
    private Collection $projects;

    /**
     * @var Collection<int, Experience>
     */
    #[ORM\OneToMany(targetEntity: Experience::class, mappedBy: 'profile')]
    #[Groups(['read:Profile'])]
    private Collection $experiences;

   
    /**
     * @var Collection<int, Image>
     */
    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'profile')]
    #[Groups(['read:Profile'])]
    private Collection $images;

    /**
     * @var Collection<int, ProfileSkill>
     */
    #[ORM\OneToMany(targetEntity: ProfileSkill::class, mappedBy: 'profile')]
    private Collection $profileSkills;

    public function __construct()
    {
        $this->projects = new ArrayCollection();
        $this->experiences = new ArrayCollection();
        $this->skills = new ArrayCollection();
        $this->images = new ArrayCollection();
        $this->created_at = new \DateTime();
        $this->updated_at = new \DateTime();
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

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(string $bio): static
    {
        $this->bio = $bio;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getGithubUrl(): ?string
    {
        return $this->github_url;
    }

    public function setGithubUrl(?string $github_url): static
    {
        $this->github_url = $github_url;

        return $this;
    }

    public function getLinkedinUrl(): ?string
    {
        return $this->linkedin_url;
    }

    public function setLinkedinUrl(?string $linkedin_url): static
    {
        $this->linkedin_url = $linkedin_url;

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
            $project->setProfile($this);
        }

        return $this;
    }

    public function removeProject(Project $project): static
    {
        if ($this->projects->removeElement($project)) {
            // set the owning side to null (unless already changed)
            if ($project->getProfile() === $this) {
                $project->setProfile(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Experience>
     */
    public function getExperiences(): Collection
    {
        return $this->experiences;
    }

    public function addExperience(Experience $experience): static
    {
        if (!$this->experiences->contains($experience)) {
            $this->experiences->add($experience);
            $experience->setProfile($this);
        }

        return $this;
    }

    public function removeExperience(Experience $experience): static
    {
        if ($this->experiences->removeElement($experience)) {
            // set the owning side to null (unless already changed)
            if ($experience->getProfile() === $this) {
                $experience->setProfile(null);
            }
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
            $image->setProfile($this);
        }

        return $this;
    }

    public function removeImage(Image $image): static
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getProfile() === $this) {
                $image->setProfile(null);
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
            $profileSkill->setProfile($this);
        }

        return $this;
    }

    public function removeProfileSkill(ProfileSkill $profileSkill): static
    {
        if ($this->profileSkills->removeElement($profileSkill)) {
            // set the owning side to null (unless already changed)
            if ($profileSkill->getProfile() === $this) {
                $profileSkill->setProfile(null);
            }
        }

        return $this;
    }
}
