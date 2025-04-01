import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    axios
      .post(
        "http://localhost:8000/api/login_check",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json", // Déclare que tu envoies des données JSON
          },
        }
      )
      .then((response) => {
        if (!response.data || !response.data.token) {
          throw new Error("Token manquant dans la réponse du serveur.");
        }

        const token = response.data.token;
        localStorage.setItem("jwt_token", token);

        // Décoder le token JWT
        let decodedToken;
        try {
          decodedToken = JSON.parse(atob(token.split(".")[1]));
        } catch (error) {
          throw new Error("Token invalide.");
        }

        // Mise à jour du contexte d'authentification
        login(token, decodedToken);

        // Redirection vers la page d'accueil après connexion
        navigate("/dashboard");
      })
      .catch((err) => {
        // Gérer les erreurs
        setError(
          err.response?.data?.message ||
            "Erreur de connexion. Vérifiez vos identifiants."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div style={{ color: "red" }}>⚠ {error}</div>}
        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
};

export default Login;
