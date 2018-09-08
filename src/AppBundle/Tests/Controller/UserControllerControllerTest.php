<?php

namespace AppBundle\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class UserControllerControllerTest extends WebTestCase
{
    public function testPing()
    {
        $client = static::createClient();

        $crawler = $client->request('GET', '/ping');
    }

}
