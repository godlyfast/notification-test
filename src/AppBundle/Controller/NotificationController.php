<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Doctrine\ORM\Query\Expr\Join;
use AppBundle\Entity\Notification;
use AppBundle\Entity\User;

class NotificationController extends Controller
{
    /**
     * @var \Doctrine\ORM\EntityManager
     */
    protected $em;

    /**
     * @var \Symfony\Component\HttpFoundation\Session
     */
    protected $session;

    protected $pusher;
    protected $user;

    /**
     * @var \Symfony\Component\Serializer\Serializer
     */
    protected $serializer;

    public function initialize()
    {
        $this->session = $this->get('session');
        $this->session->start();

        $this->pusher = $this->get('gos_web_socket.amqp.pusher');

        $this->em = $this->getDoctrine()->getManager();

        $this->user = $this->em
                ->getRepository('AppBundle:User')
                ->findOneBy(['sessionId' => $this->session->getId()]);

        $encoders = array(new JsonEncoder());
        $normalizers = array(new ObjectNormalizer());
        $this->serializer = new Serializer($normalizers, $encoders);
    }

    /**
     * @Route("/notification", name="notification")
     * @Method({"GET"})
     */
    public function viewAction(Request $request)
    {
        $this->initialize();

        $qb = $this->em->getRepository('AppBundle:Notification')
            ->createQueryBuilder('n');

        $notifications = $qb
            ->leftJoin('n.users', 'u', Join::WITH, 'u.sessionId = :sid')
            ->andWhere('n.active = true')
            ->andWhere(':now BETWEEN n.validFrom AND n.validTo')
            ->having('COUNT(u) = 0')
            ->groupby('n')
            ->orderBy('n.id', 'DESC')
            ->setParameter('sid', $this->session->getId())
            ->setParameter('now', new \DateTime())
            ->getQuery()->getResult();


        $notifications = $this->serializer->normalize($notifications);
        return new JsonResponse($notifications);
    }

    /**
     * @Route("/notification/all", name="notification-all")
     * @Method({"GET"})
     */
    public function indexAction(Request $request)
    {
        $this->initialize();

        $notifications = $this->em->getRepository('AppBundle:Notification')->findAll();

        $notifications = $this->serializer->normalize($notifications);
        return new JsonResponse($notifications);
    }

    /**
     * @Route("/notification/new", name="notification-new")
     * @Method({"POST"})
     */
    public function newAction(Request $request)
    {
        $this->initialize();

        $content = $request->getContent();
        $content = json_decode($content, true);

        $notification = new Notification();
        $notification->setTitle($content['title']);
        $notification->setMessage($content['message']);
        $notification->setValidTo(new \DateTime($content['validTo']));
        $notification->setValidFrom(new \DateTime($content['validFrom']));
        $notification->setActive($content['active']);

        $this->em->persist($notification);
        $this->em->flush($notification);

        $notification = $this->serializer->normalize($notification);

        // push(data, route_name, route_arguments, $context)
        $this->pusher->push(
          [
            'notification' => $notification,
            'msg' => 'notification_created'
          ],
          'notification_topic'
        );

        return new JsonResponse($notification);
    }

    /**
     * @Route("/notification/{id}", name="notification-edit")
     * @Method({"POST","PUT"})
     */
    public function editAction(Request $request, $id)
    {
        $this->initialize();

        $notification = $this->em->getRepository('AppBundle:Notification')->find($id);
        if (!$notification) {
            $this->createNotFoundException('Notification not found');
        }

        $content = $request->getContent();
        $content = json_decode($content, true);

        $notification->setTitle($content['title']);
        $notification->setMessage($content['message']);
        $notification->setValidTo(new \DateTime($content['validTo']));
        $notification->setValidFrom(new \DateTime($content['validFrom']));

        if(isset($content['seen'])) {
          $user = $this->user;
          if (!isset($user)) {
              $user = new User();
              $user->setSessionId($this->session->getId());
          }
          $notification->users[] = $user;
        }
        $notification->setActive($content['active']);

        $this->em->persist($notification);
        $this->em->flush($notification);

        $notification = $this->serializer->normalize($notification);

        $this->pusher->push(
          [
            'notification' => $notification,
            'msg' => 'notification_edited'
          ],
          'notification_topic'
        );

        return new JsonResponse($notification);
    }
}
