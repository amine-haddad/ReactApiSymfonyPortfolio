import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null); // Ajout du profil
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        // Décoder le token pour obtenir l'ID utilisateur
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.id;

        // Récupération des données utilisateur
        const response = await axios.get(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Données reçues user:", response.data.userProfiles);

        if (!response.data) throw new Error("Utilisateur non trouvé");

        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));

        // Vérification et récupération du profil
        if (response.data.userProfiles && response.data.userProfiles.length > 0) {
          setProfile(response.data.userProfiles[0]); // On prend le premier profil si existant
        } else {
          setProfile(null);  // Aucun profil trouvé
        }

        setIsAuthenticated(true);
      } catch (err) {
        console.error("Erreur récupération utilisateur:", err);
        setIsAuthenticated(false);
        setUser(null);
        setProfile(null);
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("user");
        setError("Erreur de récupération des données utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("jwt_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, profile, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
