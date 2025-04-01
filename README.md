# Mon projet Symfony + React avec Docker

Ce projet est une application web utilisant **Symfony** pour le backend et **React** pour le frontend, le tout dans un environnement **Dockerisé**. Ce projet comprend les éléments suivants :
- **Symfony** : Backend en PHP avec API
- **React** : Frontend pour l'interface utilisateur
- **MySQL** : Base de données pour stocker les données
- **PHPMyAdmin** : Interface pour gérer la base de données MySQL
- **Nginx** : Serveur web pour servir le frontend et gérer le reverse proxy

## Prérequis

Avant de commencer, vous devez avoir installé les outils suivants :
- [Docker](https://www.docker.com/products/docker-desktop) (et Docker Compose si vous utilisez plusieurs conteneurs)
- [Git](https://git-scm.com/)

Assurez-vous que Docker est en cours d'exécution sur votre machine.

## Installation

1. Clonez le projet sur votre machine locale :
    ```bash
    git clone https://github.com/amine-haddad/ReactApiSymfonyPortfolio.git
    cd ReactApiSymfonyPortfolio
    ```

2. Allez dans le dossier **backend** (Symfony) et installez les dépendances PHP avec Composer :
    ```bash
    cd backend
    composer install
    ```

3. Allez dans le dossier **frontend** (React) et installez les dépendances JavaScript avec npm :
    ```bash
    cd ../frontend
    npm install
    ```

4. Créez un fichier `.env` à la racine du projet pour gérer la connexion à MySQL. Exemple de fichier `.env` :
    ```env
    DATABASE_URL="mysql://root:example@mysql:3306/my_database_name?serverVersion=5.7"
    ```

5. Retournez dans le dossier **backend** et exécutez la commande suivante pour créer la base de données et appliquer les migrations :
    ```bash
    symfony console doctrine:migrations:migrate
    ```

6. Une fois la base de données prête, chargez les fixtures (données de test) :
    ```bash
    symfony console doctrine:fixtures:load
    ```

7. Construisez et démarrez les conteneurs Docker :
    ```bash
    docker-compose up --build
    ```

8. L'application est maintenant en cours d'exécution dans des conteneurs Docker. Vous pouvez accéder à l'application via les adresses suivantes :
    - **Frontend React** : [http://localhost:5173](http://localhost:5173)
    - **Backend Symfony** : [http://localhost:8000](http://localhost:8000)
    - **API Symfony** : [http://localhost:8000/api](http://localhost:8000/api)
    - **PHPMyAdmin** : [http://localhost:8081](http://localhost:8081) (pour accéder à la base de données via l'interface web)

9. Pour accéder à la base de données MySQL via **PHPMyAdmin**, vous pouvez vous connecter avec les identifiants suivants :
    - **Hôte** : `mysql`
    - **Utilisateur** : `root`
    - **Mot de passe** : `example`

## Interaction avec les conteneurs

Pour interagir avec les conteneurs Docker, vous pouvez utiliser les commandes suivantes pour entrer dans un conteneur particulier :

- **Backend Symfony (PHP)** :
    ```bash
    docker exec -it symfony_php bash
    ```

    Pour réinitialiser la base de données et relancer les fixtures, procédez comme suit :
    - `symfony console doctrine:database:drop --force`
    - `symfony console doctrine:database:create`
    - `symfony console doctrine:migration:migrate`
    - `symfony console doctrine:fixtures:load`

    Ou en une seule commande :
    - `symfony console d:d:d --force`
    - `symfony console d:d:c`
    - `symfony console d:m:m`
    - `symfony console d:f:l`

- **Frontend React** :
    ```bash
    docker exec -it react_frontend sh
    ```

- **Base de données MySQL** (via Docker) :
    ```bash
    docker exec -it symfony_mysql bash
    ```

- **Accès au serveur Nginx** (via Docker) :
    ```bash
    docker exec -it symfony_nginx sh
    ```

Une fois à l'intérieur du conteneur, vous pouvez exécuter des commandes Symfony ou React comme vous le feriez normalement.

## Configuration de Nginx

Le serveur web **Nginx** est configuré pour servir le frontend React et le backend Symfony en utilisant un reverse proxy.

- Le **frontend React** est servi sur le port `5173`.
- Le **backend Symfony** (API) est servi sur le port `8000`.

Les configurations de Nginx sont gérées via le fichier `nginx.conf` dans le conteneur **Nginx**.

## Arrêter et nettoyer

Pour arrêter les conteneurs Docker et nettoyer l'environnement, utilisez la commande suivante :
```bash
docker-compose down



Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.
