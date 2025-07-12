<?php

namespace App\Controller;

use App\Entity\Profile;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\SecurityBundle\Security;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ProfileController extends AbstractController
{
    #[Route('/api/profiles', name: 'api_profiles_list', methods: ['GET'])]
public function list(Request $request, ProfileRepository $repository, PaginatorInterface $paginator): JsonResponse
{
    $queryBuilder = $repository->createQueryBuilder('p');

    $sort = $request->query->get('sort', 'name');
    $direction = $request->query->get('direction', 'asc');
    $queryBuilder->orderBy('p.' . $sort, $direction);

    $page = $request->query->getInt('page', 1);
    $limit = $request->query->getInt('limit', 10);

    $pagination = $paginator->paginate($queryBuilder, $page, $limit);

    return $this->json([
        'items' => $pagination->getItems(),
        'total' => $pagination->getTotalItemCount(),
        'page' => $page,
        'limit' => $limit,
    ]);
}

#[Route('/api/profiles/{id}', name: 'api_profiles_detail', methods: ['GET'])]
public function detail(Profile $profile = null): JsonResponse
{
    if (!$profile) {
        return $this->json(['error' => 'Not found'], 404);
    }

    return $this->json($profile);
}

}
