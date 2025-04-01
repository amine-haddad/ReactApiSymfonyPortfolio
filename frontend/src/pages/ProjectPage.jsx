import React, { useContext, useEffect, useState } from "react";
import {useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS
import "../styles/Project.css"; // Import du fichier CSS



import { AuthContext } from "../contexts/AuthContext";
import Projects from "../components/projet/Projects";

const ProjectPage = () => {
  const {profile, setProfile} = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  
  const [isVisible, setIsVisible] = useState(false);

  const location = useLocation();

  
  useEffect(() => {
    // Vérifie si le profil est disponible
    if (!profile || !profile.id) {
      setError("Profil non trouvé");
      return;
    }
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          setError("Token manquant");
          return;
        }

        const response = await axios.get(`/api/profiles/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {

        setError("Erreur lors de la récupération du profil.");
      }
      
    };

    fetchProfile();
  }, [profile, setProfile]);


  return (
    <>
      <Projects profile={profile} />
    </>
  );
};

export default ProjectPage;
