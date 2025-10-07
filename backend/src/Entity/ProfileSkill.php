<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ProfileSkillRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
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
    #[MaxDepth(1)]
    private ?Skill $skill = null;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\Type('integer')]
    #[Assert\Range(min: 0, max: 100)]
    #[Groups(['read:ProfileSkills','write:ProfileSkills','read:Profile','read:User'])]
    private ?int $level = null;

    /**
     * @var Collection<int, Image>
     */
    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'profileSkill', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['read:ProfileSkills','write:ProfileSkills','read:Profile','read:Skill','read:User'])]
    private Collection $pictures;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $created_at = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $updated_at = null;

    public function __construct()
    {
        $this->pictures = new ArrayCollection();
    }

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

    /**
     * @return Collection<int, Image>
     */
    public function getPictures(): Collection
    {
        return $this->pictures;
    }

    public function addPicture(Image $picture): static
    {
        if (!$this->pictures->contains($picture)) {
            $this->pictures->add($picture);
            $picture->setProfileSkill($this);
        }

        return $this;
    }

    public function removePicture(Image $picture): static
    {
        if ($this->pictures->removeElement($picture)) {
            // set the owning side to null (unless already changed)
            if ($picture->getProfileSkill() === $this) {
                $picture->setProfileSkill(null);
            }
        }

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

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTimeInterface $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }
}
