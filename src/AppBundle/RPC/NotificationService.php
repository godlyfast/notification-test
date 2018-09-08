<?php

namespace AppBundle\RPC;

use Ratchet\ConnectionInterface;
use Gos\Bundle\WebSocketBundle\RPC\RpcInterface;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;

use Doctrine\ORM\EntityManager;

class NotificationService implements RpcInterface
{
    /**
     * @var $em EntityManager
     */
    protected $em;

    function __construct(EntityManager $em) {
      $this->em = $em;
    }
    /**
     * Adds the params together
     *
     * Note: $conn isnt used here, but contains the connection of the person making this request.
     *
     * @param ConnectionInterface $connection
     * @param WampRequest $request
     * @param array $params
     * @return int
     */
    public function addFunc(ConnectionInterface $connection, WampRequest $request, $params)
    {
        return array(
          "result" => array_sum($params),
          "con" => json_encode($connection)
        );
    }

    public function makeSeen(ConnectionInterface $connection, WampRequest $request, $params)
    {
        $e = $this->em->getRepository('AppBundle:Notification')->findAll();
        return ['e' => $e];
    }

    /**
     * Name of RPC, use for pubsub router (see step3)
     *
     * @return string
     */
    public function getName()
    {
        return 'notification.rpc';
    }
}
