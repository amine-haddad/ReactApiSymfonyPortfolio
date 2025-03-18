import React, { useState, useEffect } from "react";
import CustomNavBar from "../components/CustomNavBar";
import DynamicShapes from "../components/DynamicShapes";
import TypingEffect from "../components/TypingEffect";
import Profile from "../components/Profile";
import Skill from "../components/Skill";
import Project from "../components/Project";
import Experience from "../components/Experience";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/App.css";
import "../styles/TypingEffect.css";
import "../styles/Project.css";
import axios from "axios";

function Home({ profile, error }) {
  const [skills, setSkills] = useState([]);
  const [profiles, setProfiles] = useState([profile]);
  const [isSticky, setIsSticky] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true); // Définir isHomePage ici
  const [isVisible, setIsVisible] = useState(false);

  // useEffect pour récupérer les compétences
  useEffect(() => {
    if (profile) {
      const fetchSkills = async () => {
        try {
          const { data } = await axios.get("http://localhost:8000/api/profile_skills", {
            headers: { Accept: "application/ld+json" },
          });

          const skillsRequests = data.member.map((profileSkill) =>
            axios.get(`http://localhost:8000${profileSkill.skill}`, {
              headers: { Accept: "application/ld+json" },
            })
          );

          const skillsResponses = await Promise.all(skillsRequests);

          const skillsData = skillsResponses.map((res, index) => ({
            ...res.data,
            level: data.member[index].level,
          }));

          setSkills(skillsData);
        } catch (error) {
          setError("Erreur lors de la récupération des compétences");
        }
      };

      fetchSkills();
    }
  }, [profile]);

  // useEffect pour gérer le scroll et la visibilité de la navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 100); // Modifie cette valeur selon tes besoins pour activer le sticky
      setIsVisible(scrollPosition > 0); // La navbar devient visible lorsque tu scrolles
    };

    // Écoute l'événement de scroll
    window.addEventListener("scroll", handleScroll);

    // Nettoyage de l'écouteur de l'événement lors du démontage
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app">
      <div className="content">
        <DynamicShapes />
        <div className="overlay">
          <TypingEffect />
        </div>
      </div>

      {/* Navbar juste après Dynamic et TypingEffect */}
      <CustomNavBar
        profile={profile}
        error={error}
        expand="lg"
        className={`navbar navbar-light bg-light ${isHomePage ? "navbar-home" : "navbar-top"} ${isSticky ? "sticky" : ""} ${isVisible ? "visible" : ""}`}
      />

      <div className="Home-container">
        {profile && (
          <>
            {<Profile profile={profile} />}
            {<Skill skills={skills} />}
            {profile.projects && profile.projects.length > 0 && <Project projects={profile.projects} />}
            {profile.experiences && profile.experiences.length > 0 && <Experience experiences={profile.experiences} />}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
