import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Import de useLocation pour la gestion de la route
import Home from "../pages/Home"; 
import Projects from "../pages/Projects";
import About from "../pages/About";
import Experiences from "../pages/Experiences";
import CustomNavBar from "../components/CustomNavBar";  // Assurez-vous d'importer la Navbar

const AppRouter = ({ profile, error }) => {
  const location = useLocation();  // Permet de récupérer la route actuelle

  // Vérifie si l'on est sur la page d'accueil
  const isHomePage = location.pathname === "/";

  return (
    <div className="app">
      {/* Affiche la Navbar seulement si on n'est pas sur la page d'accueil */}
      {!isHomePage && <CustomNavBar profile={profile} error={error} />} 
      <Routes>
        <Route path="/" element={<Home profile={profile} error={error} />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/experiences" element={<Experiences />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
