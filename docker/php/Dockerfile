FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    zip unzip git curl libpq-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring xml

WORKDIR /var/www/html
