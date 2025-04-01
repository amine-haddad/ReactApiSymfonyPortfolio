import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

import UserProfiles from "../components/user/UserProfiles";
import UserProjects from "../components/user/UserProjects";
import User from "../components/user/User";
import UserSkills from "../components/user/UserSkills";
import UserExperiences from "../components/user/UserExperiences";

const UserHome = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]); // On stocke plusieurs profils
  const [error, setError] = useState(null);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
            setError("Token manquant");
            return;
        }

        try {
            const decodedToken = JSON.parse(atob(token.split(".")[1]));
            const userId = decodedToken.id;

            console.log("User ID:", userId); // Vérifier l'ID utilisateur

            const response = await axios.get(`/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("API Response:", response.data); // Vérifier la structure des données
            
            setProfiles(response.data.userProfiles || []); // Stocke un tableau
            setUser(response.data || {}); // Stocke l'utilisateur complet
            
          } catch (err) {
            console.error("Erreur Axios:", err.response?.data || err.message);
            setError("Erreur lors de la récupération des profils.");
          }
    };

    if (isAuthenticated) {
        fetchUserData();
    }
}, [isAuthenticated]);


  if (error) {
    return <div>{error}</div>;
  }

  if (profiles.length === 0) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <User user={user} />
      <UserProfiles user={user} profiles={profiles} />
      <UserProjects user={user} profiles={profiles} />
      <UserSkills user={user} profiles={profiles} />
      <UserExperiences user={user} profiles={profiles}/>
    </div>
  );
};

export default UserHome;
