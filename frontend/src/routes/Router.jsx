import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "../pages/Home"; 
import Projects from "../pages/Projects";
import About from "../pages/About";
import Experiences from "../pages/Experiences";
import CustomNavBar from "../components/CustomNavBar";

const AppRouter = ({ profile, error }) => {
  const location = useLocation();

  /**  est-ce la Home ? = le chemin sur lequel est la page,
   *  est elle la meme quel index a l adresse ->'/'(le slash) */
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
