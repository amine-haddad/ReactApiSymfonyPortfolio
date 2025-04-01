import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS
import "../styles/Profile.css"; // Import du fichier CSS


import DynamicShapes from "../components/DynamicShapes";
import TypingEffect from "../components/TypingEffect";
import CustomNavbar from "../components/navbar/CustomNavBar";
import Profile from "../components/profile/Profile";
import ProfileProjects from "../components/profile/ProfileProjects";
import ProfileSkills from "../components/profile/ProfileSkills";
import ProfileExperiences from "../components/profile/ProfileExperiences";
import ProfileAbout from "../components/profile/ProfileAbout";
import { useNavbar } from "../contexts/NavbarContext"; // 👈 Import du contexte

const ProfilePage = () => {
  const { id } = useParams(); // Récupère l'ID du profil dans l'URL
  
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isSticky, setIsSticky] = useState(false);
  
  const [isVisible, setIsVisible] = useState(false);

  const location = useLocation();

  
  // Vérifie si on est bien sur la page du profil avec l'ID donné
  const isProfilePage = id ? location.pathname === `/profiles/${id}` : false;

  useEffect(() => {
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
        console.error("Erreur API :", err);
        setError(err.response?.data?.message || "Erreur lors de la récupération du profil.");
      }
    };
  
    if (id) {
      fetchProfile();
    }
  }, [id]);
  

   // useEffect pour gérer le scroll et la visibilité de la navbar
   useEffect(() => {
    if (!isProfilePage) return; // Si on n'est pas sur cette page, ne fait rien
  
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 100); // Active le sticky après 100px
      setIsVisible(scrollPosition > 0);  // Devient visible dès qu'on scroll
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isProfilePage]);
  
  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Chargement...</div>;
  }

  return (
    <>
    
    <div className="content">
        <DynamicShapes />
        <div className="overlay">
          <TypingEffect />
        </div>
      </div>

      {/* Navbar juste après Dynamic et TypingEffect */}
      <CustomNavbar
        profile={profile}
        error={error}
        expand="lg"
        className={`navbar navbar-light bg-light 
          ${isProfilePage ? (isSticky ? "sticky" : "navbar-hidden") : "navbar-visible"}
          ${isVisible ? "visible" : "navbar-hidden"}
        `}
      />
      <div>
        <Profile profile={profile} error={error}/>
        <ProfileProjects profile={profile} error={error} />
        <ProfileSkills profile={profile} error={error} />        
        <ProfileExperiences profile={profile} error={error} />
        <ProfileAbout  profile={profile} error={error} />
      </div>
    </>
  );
};

export default ProfilePage;
