<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use AppBundle\Entity\User;

class UserController extends Controller
{
    /**
     * @Route("/ping")
     * @Method({"POST"})
     */
    public function pingAction(Request $request)
    {
        $this->session = $this->get('session');
        $this->session->start();

        $content = $request->getContent();
        $content = json_decode($content, true);

        $user = $this
                ->getDoctrine()
                ->getManager()
                ->getRepository('AppBundle:User')
                ->findOneBy(['sessionId' => $this->session->getId()]);
        if (!isset($user)) {
          $user = new User();
        }

        $user->getSessionId($this->session->getId());
        $user->setToken($content['token']);

        $encoders = array(new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $serializer = new Serializer($normalizers, $encoders);

        $this->getDoctrine()->getManager()->persist($user);
        $this->getDoctrine()->getManager()->flush($user);

        return new JsonResponse(['user' => $serializer->normalize($user)]);
    }

}
