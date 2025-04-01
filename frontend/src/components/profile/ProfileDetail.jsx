import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS
import "../../styles/Profile.css"; // Import du fichier CSS
import Projects from "../projet/Projects";
import Skill from "../../components/skill/Skill";
import ProfileExperience from "../experience/ProfileExperience";
import DynamicShapes from "../../components/DynamicShapes";
import TypingEffect from "../../components/TypingEffect";
import CustomNavbar from "../navbar/CustomNavBar";

const ProfileDetail = () => {
  const { id } = useParams(); // Récupère l'ID du profil dans l'URL
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState([]);
  const [profiles, setProfiles] = useState([profile]);
  const [isSticky, setIsSticky] = useState(false);
  const [isHomePage, setIsHomePage] = useState(true); // Définir isHomePage ici
  const [isVisible, setIsVisible] = useState(false);

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

        setError("Erreur lors de la récupération du profil.");
      }
      
    };

    fetchProfile();
  }, [id]);

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
        className={`navbar navbar-light bg-light ${isHomePage ? "navbar-home" : "navbar-top"} ${isSticky ? "sticky" : ""} ${isVisible ? "visible" : ""}`}
      />
      <div className="profile-container ">
        {/* Full-screen card with profile info and carousel */}
        <h2 className="text-center mb-2 col-10 mx-auto title-h2 display-1">
          Welcome to my Portfolio
        </h2>

        <div className="profile-card">
          <div className="profile-card-body">
            <div className="row">
              <div className="col-md-6">
                <h1 className="profile-card-title">{profile.name}</h1>
                <p>
                  <strong>Title:</strong> {profile.title}
                </p>
                <p>
                  <strong>Bio:</strong> {profile.bio}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a href={profile.github_url}>{profile.github_url}</a>
                </p>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a href={profile.linkedin_url}>{profile.linkedin_url}</a>
                </p>
              </div>

              {/* Carousel in the right side of the card */}
              <div className="col-md-6">
                <div
                  id="profile-carousel"
                  className="carousel slide"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner">
                    <div className="carousel-item active">
                      <a href="#projects">
                        <img
                          src="/assets/cannon_old_weapon.svg"
                          className="carousel-img"
                          alt="Projets"
                        />
                        <div className="carousel-caption d-none d-md-block">
                          <h5>Projets</h5>
                        </div>
                      </a>
                    </div>
                    <div className="carousel-item">
                      <a href="#experiences">
                        <img
                          src="/assets/clavierFondBleuter.jpeg"
                          className="carousel-img"
                          alt="Experiences"
                        />
                        <div className="carousel-caption d-none d-md-block">
                          <h5>Expériences</h5>
                        </div>
                      </a>
                    </div>
                    <div className="carousel-item">
                      <a href="#aboutme">
                        <img
                          src="/assets/defaultImgageCode.jpg"
                          className="carousel-img"
                          alt="About Me"
                        />
                        <div className="carousel-caption d-none d-md-block">
                          <h5>About Me</h5>
                        </div>
                      </a>
                    </div>
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#profile-carousel"
                    data-bs-slide="prev"
                  >
                    <span
                      className="carousel-control-prev-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Previous</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#profile-carousel"
                    data-bs-slide="next"
                  >
                    <span
                      className="carousel-control-next-icon"
                      aria-hidden="true"
                    ></span>
                    <span className="visually-hidden">Next</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Projects />
        
          <Skill />
        
        <ProfileExperience />
      </div>
    </>
  );
};

export default ProfileDetail;
