<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[ApiResource(
    normalizationContext: ['groups' => ['read:User','read:profile']],
    denormalizationContext: ['groups' => ['write:User']],
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['read:User', 'write:User',"read:Profile",'read:Project','read:Skill'])]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(['read:User', 'write:User'])]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Groups(['read:User', 'write:User'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups([ 'write:User'])]
    private ?string $password = null;

    /**
     * @var Collection<int, Profile>
     */
    #[ORM\OneToMany(targetEntity: Profile::class, mappedBy: 'user', cascade: ['persist', 'remove'])]
    #[Groups(['read:User'])]
    private Collection $userProfiles;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:User', 'write:User'])]
    private ?string $first_name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['read:User', 'write:User'])]
    private ?string $last_name = null;

    #[ORM\Column( options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeImmutable $updated_at = null;

    #[ORM\Column( options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeImmutable $created_at = null;

    public function __construct()
    {
        $this->userProfiles = new ArrayCollection();
        $this->created_at = new \DateTimeImmutable();
        $this->updated_at = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * Méthode getUsername qui permet de retourner le champs qui est utilisé pour l'authentification
     * 
     * @return string
     */
    public function getUsername(): string {
        return $this->getUserIdentifier();
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Profile>
     */
    public function getUserProfiles(): Collection
    {
        return $this->userProfiles;
    }

    public function addUserProfile(Profile $userProfile): static
    {
        if (!$this->userProfiles->contains($userProfile)) {
            $this->userProfiles->add($userProfile);
            $userProfile->setUser($this);
        }

        return $this;
    }

    public function removeUserProfile(Profile $userProfile): static
    {
        if ($this->userProfiles->removeElement($userProfile)) {
            // set the owning side to null (unless already changed)
            if ($userProfile->getUser() === $this) {
                $userProfile->setUser(null);
            }
        }

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

    public function getFirstName(): ?string
    {
        return $this->first_name;
    }

    public function setFirstName(string $first_name): static
    {
        $this->first_name = $first_name;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->last_name;
    }

    public function setLastName(string $last_name): static
    {
        $this->last_name = $last_name;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTimeImmutable $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }
}
