<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['read:Project']],
    denormalizationContext: ['groups' => ['write:Project']]
)]
#[ORM\HasLifecycleCallbacks]
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read:Project',"read:Profile"])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Project', 'write:Project',"read:Profile"])]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['read:Project', 'write:Project'])]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['read:Project', 'write:Project'])]
    private ?string $project_url = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['read:Project', 'write:Project'])]
    private ?string $image_url = null;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    #[Groups(['read:Project', 'write:Project'])]
    private ?\DateTimeInterface $updated_at = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $created_at = null;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    #[Groups(['read:profile'])]
    private ?Profile $profile = null;

    /**
     * @var Collection<int, Skill>
     */
    #[ORM\ManyToMany(targetEntity: Skill::class, inversedBy: 'projects')]
    #[Groups(['read:Project', 'write:Project','read:Profile','read:Skill'])]
    private Collection $technologies;

    /**
     * @var Collection<int, Image>
     */
    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'projects')]
    #[Groups(['read:Project', 'write:Project','read:Profile'])]
    private Collection $images;

    public function __construct()
    {
        $this->images = new ArrayCollection();
        $this->created_at = new \DateTime();
        $this->updated_at = new \DateTime();
        $this->technologies = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getProjectUrl(): ?string
    {
        return $this->project_url;
    }

    public function setProjectUrl(?string $project_url): static
    {
        $this->project_url = $project_url;

        return $this;
    }

    public function getImageUrl(): ?string
    {
        return $this->image_url;
    }

    public function setImageUrl(?string $image_url): static
    {
        $this->image_url = $image_url;

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

    public function getProfile(): ?Profile
    {
        return $this->profile;
    }

    public function setProfile(?Profile $profile): static
    {
        $this->profile = $profile;

        return $this;
    }

    /**
     * @return Collection<int, Skill>
     */
    public function getTechnologies(): Collection
    {
        return $this->technologies;
    }

    public function addTechnologies(Skill $technologies): static
    {
        if (!$this->technologies->contains($technologies)) {
            $this->technologies->add($technologies);
        }

        return $this;
    }

    public function removeTechnologies(Skill $technologies): static
    {
        $this->technologies->removeElement($technologies);

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
            $image->setProjects($this);
        }

        return $this;
    }

    public function removeImage(Image $image): static
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getProjects() === $this) {
                $image->setProjects(null);
            }
        }

        return $this;
    }
}
