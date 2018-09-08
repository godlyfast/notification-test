<?php

namespace AppBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * AppBundle\Entity\Notification
 *
 * @ORM\Table(name="notification")
 * @ORM\Entity
 */
class Notification
{

    /**
     * Many Notifications have Many Users.
     * @ORM\ManyToMany(targetEntity="User", inversedBy="notifications", cascade={"persist"})
     * @ORM\JoinTable(name="users_notifications")
     */
    public $users;

    /**
     * @var integer $id
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string $title
     *
     * @ORM\Column(name="title", type="string", length=45)
     */
    private $title;

    /**
     * @var string $message
     *
     * @ORM\Column(name="message", type="string", length=255)
     */
    private $message;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="valid_from", type="datetime", nullable=true)
     */
    private $validFrom;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="valid_to", type="datetime", nullable=true)
     */
    private $validTo;

    /**
     * @var boolean
     *
     * @ORM\Column(name="active", type="boolean", nullable=false)
     */
    private $active = true;

    public function __construct()
    {
        $now = new \DateTime();
        $this->validFrom = $now;
        $this->validTo = clone $now;

        $this->users = new \Doctrine\Common\Collections\ArrayCollection();
    }

    /**
     * Set id
     *
     * @param integer $id
     * @return Notification
     */
    public function setId($id)
    {
        $this->id = $id;
        return $this;
    }

    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set title
     *
     * @param string $title
     * @return Notification
     */
    public function setTitle($title)
    {
        $this->title = $title;
        return $this;
    }

    /**
     * Get title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
     * Set message
     *
     * @param string $message
     * @return Notification
     */
    public function setMessage($message)
    {
        $this->message = $message;
        return $this;
    }

    /**
     * Get message
     *
     * @return string
     */
    public function getMessage()
    {
        return $this->message;
    }

    /**
     * Set validFrom
     *
     * @param \DateTime $validFrom
     * @return Notification
     */
    public function setValidFrom($validFrom)
    {
        $this->validFrom = $validFrom;
        return $this;
    }

    /**
     * Get validFrom
     *
     * @return string
     */
    public function getValidFrom()
    {
        return $this->validFrom->format('Y-m-d');
    }

    /**
     * Set validTo
     *
     * @param \DateTime $validTo
     * @return Notification
     */
    public function setValidTo($validTo)
    {
        $this->validTo = $validTo;
        return $this;
    }

    /**
     * Get validTo
     *
     * @return string
     */
    public function getValidTo()
    {
        return $this->validTo->format('Y-m-d');
    }

    /**
     * Set active
     *
     * @param boolean $active
     * @return Notification
     */
    public function setActive($active)
    {
        $this->active = $active;
        return $this;
    }

    /**
     * Get active
     *
     * @return \DateTime
     */
    public function getActive()
    {
        return $this->active;
    }
}
