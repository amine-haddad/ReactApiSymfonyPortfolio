<?php
namespace App\EventListener;

use Lexik\Bundle\JWTAuthenticationBundle\Exception\ExpiredTokenException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;

class JWTExceptionListener
{
    public function onKernelException(ExceptionEvent $event)
    {
        $exception = $event->getThrowable();

        
        if ($exception instanceof ExpiredTokenException) {
            $response = new JsonResponse(['error' => 'Token expired'], 401);
            $event->setResponse($response);
        }
    }
}
