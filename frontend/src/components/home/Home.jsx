import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user, isAuthenticated, logout } = useContext(AuthContext); // Accès à user et isAuthenticated depuis le contexte
  const navigate = useNavigate(); 

  // Si l'utilisateur n'est pas authentifié ou si on n'a pas encore les données, on montre un message de chargement
  if (!isAuthenticated) {
    return <div>Chargement...</div>;
  }

  const handleLogout = () => {
    logout(); // Appelle la fonction logout du contexte
    navigate('/login'); // Redirige vers la page de connexion
  };

  return (
    <div className="home-page">
      <h1>Bienvenue, {user ? user.name : 'Utilisateur'} !</h1>
      {user && (
        <>
          <p>Nom : {user.name}</p>
          <p>Email : {user.email}</p>
          <p>Rôle : {user.role}</p>
        </>
      )}

      {/* Bouton de déconnexion */}
      <button onClick={handleLogout}>Se déconnecter</button>

      {/* Optionnel : autre contenu de la page d'accueil */}
      <div className="welcome-message">
        <p>Vous êtes connecté et prêt à explorer votre compte.</p>
        {/* Ajoute ici d'autres sections comme des liens vers des pages ou des fonctionnalités */}
      </div>
    </div>
  );
}

export default Home;
