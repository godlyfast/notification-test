# notification-test

# Notification Developer Test (Symfony2/Backbone)

This project tests a developer's ability to read and write clean and maintainable code using relevant technologies. The project uses the following technologies:

- Symfony 2.8
- Backbone.js
- RequireJS
- SCSS
- Grunt

The goal of this project is to display new notifications to users on the base route of the project. The data structures and methods for adding/editing notifications have already been implemented on the **/list** route.

### Task

The task is to implement the following functionality on the default route of the web application.

The front-end Backbone view should poll the server every minute and dynamically render any new, valid (within the valid date range), active notifications to the user. Notifications should render the title and message, with new notifications appearing above older ones. The server should track which notifications have been shown to the user through the user session, not displaying any previously-rendered notifications on page reload. Rendered notifications should be dismissable and fade away on-click. The page styling should match the existing look and feel of the web application to the developer's best judgement. The page should be mobile responsive and implemented through SCSS. An attempt should be made to understand and re-use the existing codebase.

### Solution

The solution uses webSocket connection to maintain notifications in up-to-date state and also uses RabbitMQ for for pushing messages from the server to all clients when any notification state was changed. In this way user will see immediate view update when any change was applied to any notification, and this update will be populated to all user's devices connected to a server via socket with near-zero delay.

[Demo App Link](http://ec2-18-207-93-146.compute-1.amazonaws.com)

### The libs used here:

- [Docker](https://www.docker.com/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [Symfony](https://symfony.com/)
- [Backbone](https://backbonejs.org/)
- [Symfony WebSocketBundle](https://github.com/GeniusesOfSymfony/WebSocketBundle)
- [PHP React](https://reactphp.org)

### Getting Started

## Prerequisites

Install docker and docker-compose

- [Docker](https://docs.docker.com/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installing

Navigate to laradock directory

`cd laradock`

Copy env file from example one

`cp -rf env-example .env`

Start docker containers in detached mode (-d flag)
`docker-compose up -d apache2`

Spawn workspace console

`docker-compose exec workspace bash`

Install composer

`composer install`

Install node modules

`npm install`

Run grunt watcher

`./node_modules/.bin/grunt watch`

Navigate to http://localhost:15672 and bind gos_websocket_exchange to gos_websocket queue in rabbitmq admin console

Navigate to http://localhost:8882

### Have fun!

A sample sqlite database has been included in the project repository in app/data.
