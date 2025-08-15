# Mon projet Symfony + React avec Docker

Ce projet est une application web utilisant **Symfony** pour le backend et **React** pour le frontend, le tout dans un environnement **Dockerisé**.

## Prérequis

- [Docker](https://www.docker.com/products/docker-desktop) (et Docker Compose)
- [Git](https://git-scm.com/)

Assurez-vous que Docker est en cours d'exécution sur votre machine.

## Installation

1. **Clonez le projet sur votre machine locale :**
    ```bash
    git clone https://github.com/amine-haddad/ReactApiSymfonyPortfolio.git
    cd ReactApiSymfonyPortfolio
    ```

2. **Créez un fichier `.env.local` dans le dossier `backend/` pour la connexion MySQL et la passphrase JWT :**
    ```env
    DATABASE_URL="mysql://symfony:symfony@mysql:3306/symfonydb?serverVersion=5.7"
    JWT_PASSPHRASE=VotrePassphraseIci
    ```
    > Remplacez `VotrePassphraseIci` par une phrase secrète de votre choix (voir conseils plus bas).

3. **Générez les clés JWT dans le conteneur PHP :**
    ```bash
    docker-compose exec php mkdir -p config/jwt
    docker-compose exec php openssl genrsa -aes256 -out config/jwt/private.pem 4096
    # → Saisissez la même passphrase que dans .env.local
    docker-compose exec php openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
    docker-compose exec php chmod 644 config/jwt/private.pem config/jwt/public.pem
    ```
    > Si des clés existent déjà, supprimez-les d'abord :
    > ```bash
    > rm -f backend/config/jwt/private.pem backend/config/jwt/public.pem
    > ```

4. **Construisez et démarrez les conteneurs Docker :**
    ```bash
    docker-compose up --build
    ```

5. **Installez les dépendances dans les conteneurs Docker :**
    - Backend Symfony :
        ```bash
        docker-compose exec php composer install
        ```
    - Frontend React :
        ```bash
        docker-compose exec react npm install
        ```

6. **Initialisez la base de données et chargez les fixtures :**
    ```bash
    docker-compose exec php symfony console doctrine:migrations:migrate
    docker-compose exec php symfony console doctrine:fixtures:load
    ```

7. **Accédez à l'application :**
    - Frontend React : [http://localhost:5173](http://localhost:5173)
    - Backend Symfony : [http://localhost:8000](http://localhost:8000)
    - API Symfony : [http://localhost:8000/api](http://localhost:8000/api)
    - PHPMyAdmin : [http://localhost:8081](http://localhost:8081)

    Pour PHPMyAdmin :
    - Hôte : `mysql`
    - Utilisateur : `symfony`
    - Mot de passe : `symfony`

---

> **Important :**  
> Toutes les commandes Docker doivent être lancées à la racine du projet.

---

### 🔑 Conseils pour la passphrase JWT

- Utilisez une phrase secrète difficile à deviner, avec lettres, chiffres et caractères spéciaux.
- Exemples : `MaPhraseSecrète2025!`, `jwt-Secret_#42!`
- Gardez-la confidentielle et ne la partagez pas publiquement.

---

**Remarques :**
- Chaque développeur doit générer ses propres clés JWT et définir sa propre passphrase locale.
- Ne versionnez jamais les fichiers `private.pem` et `public.pem` dans le dépôt Git.
- Vérifiez que les fichiers sont bien présents dans `backend/config/jwt/` et lisibles dans le conteneur PHP.
