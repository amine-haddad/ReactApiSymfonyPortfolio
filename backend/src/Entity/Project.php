<?php

namespace App\Entity;

use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use ApiPlatform\Metadata\Get;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
#[ORM\HasLifecycleCallbacks]
/*#[ApiResource(
    normalizationContext: [
        'groups' => ['read:Project'],
        'enable_max_depth' => true
    ],
    denormalizationContext: ['groups' => ['write:Project']],
)]*/
#[ApiFilter(SearchFilter::class, properties: ['profile.id' => 'exact'])]
#[UniqueEntity(fields: ['slug'], message: 'Ce slug est déjà utilisé.')]
/*#[Get(
    uriTemplate: '/profiles/{profileId}/projects',
    provider: ProjectProvider::class,
    normalizationContext: ['groups' => ['read:Project']]
)]*/
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read:Project', 'write:Project', 'read:Profile', 'read:User'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Project', 'write:Project','read:Profile','read:User'])]
    #[Assert\NotBlank]
    #[Assert\Length(max: 255)]
    #[Assert\Type('string')]
    #[Assert\Regex(
        pattern: '/<[^>]*>/',
        match: false,
        message: 'Les balises HTML ne sont pas autorisées.'
    )]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['read:Project', 'write:Project', 'read:Profile', 'read:User'])]
    #[Assert\NotBlank]
    #[Assert\Length(max: 2000)]
    #[Assert\Type('string')]
    #[Assert\Regex(
        pattern: '/<[^>]*>/',
        match: false,
        message: 'Les balises HTML ne sont pas autorisées.'
    )]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['read:Project', 'write:Project', 'read:Profile', 'read:User'])]
    #[Assert\Length(max: 255)]
    #[Assert\Url]
    private ?string $project_url = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['read:Project', 'write:Project', 'read:Profile', 'read:User'])]
    #[Assert\Length(max: 255)]
    #[Assert\Url]
    private ?string $image_url = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Project', 'write:Project','read:Profile','read:User'])]
    #[Assert\NotBlank]
    #[Assert\Length(max: 2000)]
    #[Assert\Type('string')]
    #[Assert\Regex(
        pattern: '/<[^>]*>/',
        match: false,
        message: 'Les balises HTML ne sont pas autorisées.'
    )]
    private ?string $slug = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['read:Project'])]
    private ?\DateTimeInterface $updated_at = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    #[Groups(['read:Project'])]
    private ?\DateTimeInterface $created_at = null;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    #[Groups(['read:Project', 'write:Project'])]
    #[MaxDepth(1)]
    private ?Profile $profile = null;

    /**
     * @var Collection<int, Skill>
     */
    #[ORM\ManyToMany(targetEntity: Skill::class, inversedBy: 'projects')]
    #[Groups(['read:Project', 'write:Project', 'read:Profile'])]
    #[MaxDepth(1)]
    private Collection $technologies;

    /**
     * @var Collection<int, Image>
     */
    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'project', cascade: ['persist', 'remove'])]
    #[Groups(['read:Project', 'write:Project', 'read:Profile', 'read:User'])]
    #[MaxDepth(1)]
    private Collection $images;

    public function __construct()
    {
        $this->technologies = new ArrayCollection();
        $this->images = new ArrayCollection();
    }

    #[ORM\PrePersist]
    public function onPrePersist(): void
    {
        $this->created_at = new \DateTimeImmutable();
        $this->updated_at = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updated_at = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getProjectUrl(): ?string
    {
        return $this->project_url;
    }

    public function setProjectUrl(?string $project_url): self
    {
        $this->project_url = $project_url;
        return $this;
    }

    public function getImageUrl(): ?string
    {
        return $this->image_url;
    }

    public function setImageUrl(?string $image_url): self
    {
        $this->image_url = $image_url;
        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(?\DateTimeInterface $updated_at): self
    {
        $this->updated_at = $updated_at;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): self
    {
        $this->created_at = $created_at;
        return $this;
    }

    public function getProfile(): ?Profile
    {
        return $this->profile;
    }

    public function setProfile(?Profile $profile): self
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

    public function addTechnology(Skill $technology): self
    {
        if (!$this->technologies->contains($technology)) {
            $this->technologies->add($technology);
        }

        return $this;
    }

    public function removeTechnology(Skill $technology): self
    {
        $this->technologies->removeElement($technology);

        return $this;
    }

    /**
     * @return Collection<int, Image>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Image $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setProject($this);
        }

        return $this;
    }

    public function removeImage(Image $image): self
    {
        if ($this->images->removeElement($image)) {
            if ($image->getProject() === $this) {
                $image->setProject(null);
            }
        }

        return $this;
    }
}
