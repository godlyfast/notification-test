#!/usr/bin/env sh
/var/opt/check_rabbitmq.py --server rabbitmq --user guest --password guest \
&& /var/www/app/console gos:websocket:server
