<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Repository\UserRepository;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserController extends AbstractController
{
    // Permet à l'utilisateur connecté de récupérer ses propres infos
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function me(Security $security): JsonResponse
    {
        $user = $security->getUser();

        if (!$user) {
            return $this->json([
                'error' => 'Unauthorized',
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        return $this->json([
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'first_name' => $user->getFirstName(),
                'last_name' => $user->getLastName(),
                'roles' => $user->getRoles(),
                // Ajoute ici d'autres champs simples si besoin
            ]
        ]);
    }

    // Liste des utilisateurs (admin voit tout, sinon juste soi-même)
    #[Route('/api/users', name: 'api_users_list', methods: ['GET'])]
    public function list(UserRepository $repository, Security $security, Request $request): JsonResponse
    {
        $user = $security->getUser();

        // Récupération des paramètres de tri, pagination, filtre
        $sortParam = $request->query->get('sort', '["id","ASC"]');
        $rangeParam = $request->query->get('range', '[0,9]');
        $sortArr = json_decode($sortParam, true);
        $rangeArr = json_decode($rangeParam, true);

        $sort = $sortArr[0] ?? 'id';
        $order = $sortArr[1] ?? 'ASC';
        $start = $rangeArr[0] ?? 0;
        $end = $rangeArr[1] ?? 9;
        $filterRaw = $request->query->get('filter', '{}');
        $filter = json_decode($filterRaw, true);
        if (!is_array($filter)) {
            $filter = [];
        }
        $q = $filter['q'] ?? '';

        // Mapping des champs pour le tri
        $fieldMap = [
            'first_name' => 'first_name',
            'last_name' => 'last_name',
            'email' => 'email',
            'slug' => 'slug',
            'id' => 'id',
        ];

        // Sécurise le champ de tri
        if (isset($fieldMap[$sort])) {
            $sort = $fieldMap[$sort];
        } else {
            $sort = 'id';
        }
        $allowedSortFields = array_values($fieldMap);
        if (!in_array($sort, $allowedSortFields)) {
            $sort = 'id';
        }

        // Si admin, accès à tous les utilisateurs, sinon uniquement soi-même
        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            $qb = $repository->createQueryBuilder('u');
            if ($q) {
                $qb->andWhere('u.email LIKE :q OR u.first_name LIKE :q OR u.last_name LIKE :q')
                   ->setParameter('q', "%$q%");
            }
            $qb->orderBy('u.' . $sort, $order)
               ->setFirstResult($start)
               ->setMaxResults($end - $start);

            $users = $qb->getQuery()->getResult();

            // Compte total pour la pagination
            $total = $repository->createQueryBuilder('u')
                ->select('COUNT(u.id)')
                ->getQuery()
                ->getSingleScalarResult();
        } else {
            // Utilisateur non admin : ne voit que lui-même
            $users = [$user];
            $total = 1;
        }

        // Formatage des données pour la réponse
        $data = [];
        foreach ($users as $userItem) {
            $data[] = [
                'id' => $userItem->getId(),
                'email' => $userItem->getEmail(),
                'first_name' => $userItem->getFirstName(),
                'last_name' => $userItem->getLastName(),
                'slug' => $userItem->getSlug(),
                // autres champs
            ];
        }

        $response = new JsonResponse($data);
        $response->headers->set('Content-Range', "users $start-" . (min($end-1, $total-1)) . "/$total");
        $response->headers->set('Access-Control-Expose-Headers', 'Content-Range');
        return $response;
    }

    // Affiche un utilisateur (admin ou soi-même uniquement)
    #[Route('/api/users/{id}', name: 'api_users_show', methods: ['GET'])]
    public function show(int $id, UserRepository $repo, Security $security): JsonResponse
    {
        $user = $repo->find($id);
        $currentUser = $security->getUser();

        if (!$user) {
            return $this->json(['error' => 'Not found'], 404);
        }

        // Vérifie que seul l'admin ou l'utilisateur lui-même peut accéder
        if (!in_array('ROLE_ADMIN', $currentUser->getRoles()) && $currentUser->getId() !== $user->getId()) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        return $this->json([
            'id' => $user->getId(),
            'first_name' => $user->getFirstName(),
            'last_name' => $user->getLastName(),
            'slug' => $user->getSlug(),
            'email' => $user->getEmail(),
            'creeLe' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
            'modifieLe' => $user->getUpdatedAt()?->format('Y-m-d H:i:s'),
            // autres champs
        ]);
    }

    // Mise à jour d'un utilisateur (admin ou soi-même uniquement)
    #[Route('/api/users/{id}', name: 'api_users_update', methods: ['PUT', 'PATCH'])]
    public function update(
        int $id,
        Request $request,
        UserRepository $repo,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        Security $security
    ): JsonResponse
    {
        $user = $repo->find($id);
        $currentUser = $security->getUser();

        if (!$user) {
            return $this->json(['error' => 'Not found'], 404);
        }

        // Vérifie que seul l'admin ou l'utilisateur lui-même peut modifier
        if (!in_array('ROLE_ADMIN', $currentUser->getRoles()) && $currentUser->getId() !== $user->getId()) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $data = json_decode($request->getContent(), true);
        if (isset($data['email'])) $user->setEmail($data['email']);
        if (isset($data['first_name'])) $user->setFirstName($data['first_name']);
        if (isset($data['last_name'])) $user->setLastName($data['last_name']);
        // Seul un admin peut changer les rôles
        if (isset($data['roles']) && in_array('ROLE_ADMIN', $currentUser->getRoles())) {
            $user->setRoles($data['roles']);
        }
        if (isset($data['password']) && $data['password']) {
            $user->setPassword($passwordHasher->hashPassword($user, $data['password']));
        }
        $em->flush();
        return $this->json([
            'id' => $user->getId(),
            'first_name' => $user->getFirstName(),
            'last_name' => $user->getLastName(),
            'slug' => $user->getSlug(),
            'email' => $user->getEmail(),
            // autres champs
        ]);
    }

    // Suppression d'un utilisateur (admin ou soi-même uniquement)
    #[Route('/api/users/{id}', name: 'api_users_delete', methods: ['DELETE'])]
    public function delete(int $id, UserRepository $repo, EntityManagerInterface $em, Security $security): JsonResponse
    {
        $user = $repo->find($id);
        $currentUser = $security->getUser();

        if (!$user) {
            return $this->json(['error' => 'Not found'], 404);
        }

        // Vérifie que seul l'admin ou l'utilisateur lui-même peut supprimer
        if (!in_array('ROLE_ADMIN', $currentUser->getRoles()) && $currentUser->getId() !== $user->getId()) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $em->remove($user);
        $em->flush();
        return $this->json([
            'id' => $id,
            'message' => 'Utilisateur supprimé'
        ]);
    }

    // Création d'un utilisateur (réservé à l'admin)
    #[Route('/api/users', name: 'api_users_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        Security $security
    ): JsonResponse
    {
        $currentUser = $security->getUser();

        // Vérifie que seul l'admin peut créer un utilisateur
        if (!$currentUser || !in_array('ROLE_ADMIN', $currentUser->getRoles())) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $data = json_decode($request->getContent(), true);

        $user = new \App\Entity\User();
        $user->setEmail($data['email'] ?? '');
        $user->setFirstName($data['first_name'] ?? '');
        $user->setLastName($data['last_name'] ?? '');
        // Toujours ROLE_USER à la création
        $user->setRoles(['ROLE_USER']);

        $hashedPassword = $passwordHasher->hashPassword($user, $data['password'] ?? '');
        $user->setPassword($hashedPassword);

        $em->persist($user);
        $em->flush();

        return $this->json([
            'id' => $user->getId(),
            'slug' => $user->getSlug(),
            'first_name' => $user->getFirstName(),
            'last_name' => $user->getLastName(),
            'email' => $user->getEmail(),
            // autres champs
        ]);
    }
}
