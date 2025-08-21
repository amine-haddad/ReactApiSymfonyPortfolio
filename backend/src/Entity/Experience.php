<?php
namespace App\Entity;

use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\ExperienceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Annotation\MaxDepth;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ExperienceRepository::class)]
//#[ApiResource(
//    normalizationContext: [
//        'groups' => ['read:Experience'],
//        'enable_max_depth' => true
//    ],
//    denormalizationContext: ['groups' => ['write:Experience']]
//)]
#[ApiFilter(SearchFilter::class, properties: [
    'profile.id' => 'exact',
    'profile.slug' => 'exact'
])]
#[ORM\HasLifecycleCallbacks]
class Experience
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read:Experience', 'write:Experience', 'read:Profile', 'read:User'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Experience', 'write:Experience', 'read:Profile', 'read:User'])]
    #[Assert\NotBlank(message: "Role cannot be blank")]
    #[Assert\Length(min: 3, max: 255, minMessage: "Role must be at least {{ limit }} characters long", maxMessage: "Role cannot be longer than {{ limit }} characters")]
    private ?string $role = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Experience', 'write:Experience', 'read:Profile', 'read:User'])]
    #[Assert\NotBlank(message: "Company cannot be blank")]
    private ?string $compagny = null;

    #[ORM\Column(name: "start_date", type: Types::DATE_MUTABLE)]
    #[Groups(['read:Experience', 'write:Experience', 'read:Profile', 'read:User'])]
    #[Assert\NotNull(message: "Start date cannot be null")]
    #[Assert\Date(message: "Start date must be a valid date")]
    private ?\DateTimeInterface $startDate = null;

    #[ORM\Column(name: "end_date", type: Types::DATE_MUTABLE)]
    #[Groups(['read:Experience', 'write:Experience', 'read:Profile', 'read:User'])]
    #[Assert\NotNull(message: "End date cannot be null")]
    #[Assert\Date(message: "End date must be a valid date")]
    #[Assert\GreaterThan(propertyPath: "startDate", message: "End date must be after the start date")]
    private ?\DateTimeInterface $endDate = null;

    #[ORM\Column(type : Types::TEXT)]
    #[Groups(['read:Experience', 'write:Experience', 'read:Profile', 'read:User'])]
    #[Assert\NotBlank(message: "Description cannot be blank")]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:Experience', 'write:Experience', 'read:User'])]
    private ?string $slug = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $updated_at = null;

    #[ORM\Column(type : Types::DATETIME_MUTABLE, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeInterface $created_at = null;

    #[ORM\ManyToOne(inversedBy : 'experiences', cascade: ['persist', 'remove'])]
    #[Groups(['read:Experience', 'write:Experience'])]
    #[MaxDepth(1)]
    private ?Profile $profile = null;

    /**
     * @var Collection<int, Image>
     */
    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'experiences', cascade: ['persist', 'remove'])]
    #[Groups(['read:Experience', 'write:Experience','read:User','read:Profile'])]
    #[MaxDepth(1)]
    private Collection $images;

    public function __construct()
    {
        $this->created_at = new \DateTime();
        $this->updated_at = new \DateTime();
        $this->images     = new ArrayCollection();
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;
        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRole(): ?string
    {
        return $this->role;
    }

    public function setRole(string $role): static
    {
        $this->role = $role;

        return $this;
    }

    public function getCompagny(): ?string
    {
        return $this->compagny;
    }

    public function setCompagny(string $compagny): static
    {
        $this->compagny = $compagny;

        return $this;
    }

    public function getStartDate(): ?\DateTimeInterface
    {
        return $this->startDate;
    }

    public function setStartDate(\DateTimeInterface $startDate): static
    {
        $this->startDate = $startDate;
        return $this;
    }

    public function getEndDate(): ?\DateTimeInterface
    {
        return $this->endDate;
    }

    public function setEndDate(\DateTimeInterface $endDate): static
    {
        $this->endDate = $endDate;
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

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    #[ORM\PreUpdate]
    public function preUpdate(): void
    {
        $this->updated_at = new \DateTime();
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTimeInterface $updated_at): static
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
     * @return Collection<int, Image>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Image $image): static
    {
        if (! $this->images->contains($image)) {
            $this->images->add($image);
            $image->setExperiences($this);
        }

        return $this;
    }

    public function removeImage(Image $image): static
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getExperiences() === $this) {
                $image->setExperiences(null);
            }
        }

        return $this;
    }
}
