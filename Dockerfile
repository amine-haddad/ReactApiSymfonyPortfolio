FROM php:8.3-fpm

# Installe les dépendances nécessaires pour Symfony
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    libicu-dev \
    git \
    unzip \
    curl \
    tzdata \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && docker-php-ext-install intl \
    && docker-php-ext-install pdo pdo_mysql \
    && rm -rf /var/lib/apt/lists/*

# Configure le fuseau horaire
ENV TZ=Europe/Paris

# Installation du Symfony CLI
RUN curl -sS https://get.symfony.com/cli/installer | bash
RUN mv /root/.symfony*/bin/symfony /usr/local/bin/symfony

WORKDIR /var/www/html

# Installe Composer (si tu ne l'as pas déjà dans ton projet)
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copie ton code dans le conteneur
COPY . .

COPY docker/php/custom.ini /usr/local/etc/php/conf.d/

# Assure-toi que le dossier /var/www/html ait les bonnes permissions
RUN chown -R www-data:www-data /var/www/html

# Expose le port de l'application Symfony (si nécessaire pour le CLI ou un serveur local)
EXPOSE 8000