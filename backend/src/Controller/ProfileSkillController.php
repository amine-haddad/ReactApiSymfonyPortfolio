<?php

namespace App\Controller;

use App\Repository\ProfileSkillRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ProfileSkillController extends AbstractController
{
    #[Route('/profile/skill', name: 'app_profile_skill')]
    public function index(): Response
    {
        return $this->render('profile_skill/index.html.twig', [
            'controller_name' => 'ProfileSkillController',
        ]);
    }

    #[Route('/api/profile_skills', name: 'api_profile_skills_list', methods: ['GET'])]
    public function list(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        // Récupère tous les profils de l'utilisateur connecté
        $profiles = $em->getRepository(\App\Entity\Profile::class)->findBy(['user' => $user]);
        $profileIds = array_map(fn($p) => $p->getId(), $profiles);

        // Récupère tous les ProfileSkill liés à ces profils
        $qb = $em->createQueryBuilder()
            ->select('ps, s, p')
            ->from(\App\Entity\ProfileSkill::class, 'ps')
            ->join('ps.skill', 's')
            ->join('ps.profile', 'p')
            ->where('ps.profile IN (:profileIds)')
            ->setParameter('profileIds', $profileIds);

        $page = max(1, (int)$request->query->get('page', 1));
        $limit = max(1, (int)$request->query->get('limit', 10));
        $qb->setFirstResult(($page - 1) * $limit)
           ->setMaxResults($limit);

        $profileSkills = $qb->getQuery()->getResult();

        $data = [];
        foreach ($profileSkills as $ps) {
            $skill = $ps->getSkill();
            $profile = $ps->getProfile();
            $data[] = [
                'id' => $ps->getId(),
                'level' => $ps->getLevel(),
                'profile' => [
                    'id' => $profile->getId(),
                    'name' => $profile->getName(),
                    'user' => $profile->getUser()?->getId(), // <-- AJOUTE CETTE LIGNE
                ],
                'skill' => [
                    'id' => $skill->getId(),
                    'name' => $skill->getName(),
                    'slug' => $skill->getSlug(),
                    'images' => array_map(function($img) {
                        return [
                            'id' => $img->getId(),
                            'name' => $img->getName(),
                            'url' => method_exists($img, 'getUrl') ? $img->getUrl() : $img->getName(),
                        ];
                    }, $skill->getImages()->toArray()),
                ],
            ];
        }

        $response = new JsonResponse($data);
        $response->headers->set('Content-Range', 'profileSkills 0-' . (count($data)-1) . '/' . count($data));
        $response->headers->set('Access-Control-Expose-Headers', 'Content-Range');
        return $response;
    }

    #[Route('/api/profile_skills/{id}', name: 'api_profile_skills_show', methods: ['GET'])]
    public function show(int $id, EntityManagerInterface $em): JsonResponse
    {
        $ps = $em->getRepository(\App\Entity\ProfileSkill::class)->find($id);
        if (!$ps) {
            return new JsonResponse(['error' => 'Not found'], 404);
        }
        $skill = $ps->getSkill();
        $profile = $ps->getProfile();
        $data = [
            'id' => $ps->getId(),
            'level' => $ps->getLevel(),
            'profile' => [
                'id' => $profile->getId(),
                'name' => $profile->getName(),
                'user' => $profile->getUser()?->getId(),
            ],
            'skill' => [
                'id' => $skill->getId(),
                'name' => $skill->getName(),
                'slug' => $skill->getSlug(),
                'images' => array_map(function($img) {
                    return [
                        'id' => $img->getId(),
                        'name' => $img->getName(),
                        'url' => method_exists($img, 'getUrl') ? $img->getUrl() : $img->getName(),
                    ];
                }, $skill->getImages()->toArray()),
            ],
        ];
        return new JsonResponse($data);
    }

    #[Route('/api/profile_skills', name: 'api_profile_skills_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $profile = $em->getRepository(\App\Entity\Profile::class)->find($data['profile']);
        $skill = $em->getRepository(\App\Entity\Skill::class)->find($data['skill']);
        if (!$profile || !$skill) {
            return new JsonResponse(['error' => 'Invalid profile or skill'], 400);
        }
        $ps = new \App\Entity\ProfileSkill();
        $ps->setProfile($profile);
        $ps->setSkill($skill);
        $ps->setLevel($data['level'] ?? 0);
        $em->persist($ps);
        $em->flush();
        return new JsonResponse(['id' => $ps->getId()], 201);
    }

    #[Route('/api/profile_skills/{id}', name: 'api_profile_skills_update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $ps = $em->getRepository(\App\Entity\ProfileSkill::class)->find($id);
        if (!$ps) {
            return new JsonResponse(['error' => 'Not found'], 404);
        }
        $data = json_decode($request->getContent(), true);
        if (isset($data['level'])) {
            $ps->setLevel($data['level']);
        }
        if (isset($data['profile'])) {
            $profile = $em->getRepository(\App\Entity\Profile::class)->find($data['profile']);
            if ($profile) $ps->setProfile($profile);
        }
        if (isset($data['skill'])) {
            $skill = $em->getRepository(\App\Entity\Skill::class)->find($data['skill']);
            if ($skill) $ps->setSkill($skill);
        }
        $em->flush();
        return new JsonResponse(['id' => $ps->getId()]);
    }

    #[Route('/api/profile_skills/{id}', name: 'api_profile_skills_delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        $ps = $em->getRepository(\App\Entity\ProfileSkill::class)->find($id);
        if (!$ps) {
            return new JsonResponse(['error' => 'Not found'], 404);
        }
        $em->remove($ps);
        $em->flush();
        return new JsonResponse(null, 204);
    }
}
