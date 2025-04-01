// src/pages/LoginPage/LoginPage.js
import React from 'react';
import Login from '../components/Login/Login';

const LoginPage = () => {
  return (
    <div>
      <h1>Connexion</h1>
      <Login />  {/* Intégration du composant Login ici */}
    </div>
  );
};

export default LoginPage;
