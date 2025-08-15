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

2. Créez un fichier `.env.local` dans le dossier **backend** pour gérer la connexion à MySQL. Exemple de contenu :
    ```env
    DATABASE_URL="mysql://symfony:symfony@mysql:3306/symfonydb?serverVersion=5.7"
    ```

3. Générez les clés JWT pour l’authentification (obligatoire pour chaque développeur) :
    Après le clonage du projet, chaque développeur doit générer ses propres clés JWT dans le dossier `backend/config/jwt` (les clés ne sont pas versionnées pour des raisons de sécurité) :

    ```bash
    docker-compose exec php php bin/console lexik:jwt:generate-keypair
    ```

    N’oubliez pas de définir la même passphrase dans le fichier `backend/.env.local` :

    ```env
    JWT_PASSPHRASE=ta_passphrase
    ```

4. Construisez et démarrez les conteneurs Docker :
    ```bash
    docker-compose up --build
    ```

5. **Installez les dépendances dans les conteneurs Docker** (et non sur votre machine hôte) :
    - Pour le backend Symfony :
        ```bash
        docker-compose exec php composer install
        ```
    - Pour le frontend React :
        ```bash
        docker-compose exec react npm install
        ```

6. Initialisez la base de données et chargez les fixtures (toujours dans le conteneur PHP) :
    ```bash
    docker-compose exec php symfony console doctrine:migrations:migrate
    docker-compose exec php symfony console doctrine:fixtures:load
    ```

7. L'application est maintenant en cours d'exécution dans des conteneurs Docker. Vous pouvez accéder à l'application via les adresses suivantes :
    - **Frontend React** : [http://localhost:5173](http://localhost:5173)
    - **Backend Symfony** : [http://localhost:8000](http://localhost:8000)
    - **API Symfony** : [http://localhost:8000/api](http://localhost:8000/api)
    - **PHPMyAdmin** : [http://localhost:8081](http://localhost:8081) (pour accéder à la base de données via l'interface web)

8. Pour accéder à la base de données MySQL via **PHPMyAdmin**, vous pouvez vous connecter avec les identifiants suivants :
    - **Hôte** : `mysql`
    - **Utilisateur** : `symfony`
    - **Mot de passe** : `symfony`

## Interaction avec les conteneurs

Pour interagir avec les conteneurs Docker, vous pouvez utiliser les commandes suivantes pour entrer dans un conteneur particulier :

- **Backend Symfony (PHP)** :
    ```bash
    docker exec -it symfony_php bash
    ```

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
```

---

> **Important :**  
> Toutes les commandes Docker doivent être lancées à la racine du projet.

---

### 🔑 Génération des clés JWT avec passphrase (sécurité et droits)

Après avoir cloné le projet, chaque développeur doit générer ses propres clés JWT pour l’authentification.  
**Pour plus de sécurité, il est recommandé de protéger la clé privée avec une passphrase.**

1. **Supprime les anciennes clés si elles existent** (dans `backend/config/jwt/`) :
    ```bash
    rm -f backend/config/jwt/private.pem backend/config/jwt/public.pem
    ```

2. **Génère une nouvelle paire de clés dans le conteneur PHP** :
    ```bash
    docker-compose exec php mkdir -p config/jwt
    docker-compose exec php openssl genrsa -aes256 -out config/jwt/private.pem 4096
    # → Saisissez une passphrase de votre choix (ex : Arsenal_1977)
    docker-compose exec php openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
    ```

3. **Assurez-vous que les fichiers sont lisibles par le serveur** :
    ```bash
    docker-compose exec php chmod 644 config/jwt/private.pem config/jwt/public.pem
    ```

4. **Ajoutez la même passphrase dans le fichier `backend/.env.local`** :
    ```env
    JWT_PASSPHRASE=VotrePassphraseIci
    ```
    *(Remplacez `VotrePassphraseIci` par la passphrase que vous avez choisie à l’étape précédente)*

**Conseils pour la passphrase :**
- Utilisez une phrase secrète difficile à deviner, avec lettres, chiffres et caractères spéciaux.
- Exemple : `Arsenal_1977`, `MaPhraseSecrète2025!`, `jwt-Secret_#42!`
- Gardez-la confidentielle et ne la partagez pas publiquement.

5. **Redémarrez le conteneur PHP pour prendre en compte la passphrase** :
    ```bash
    docker-compose restart php
    ```

---

**Remarque :**  
- Chaque développeur doit générer ses propres clés JWT et définir sa propre passphrase locale.
- Ne versionnez jamais les fichiers `private.pem` et `public.pem` dans le dépôt Git.
- Vérifiez que les fichiers sont bien présents dans `backend/config/jwt/` et lisibles dans le conteneur PHP.
