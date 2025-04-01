import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Experience.css";
import { useParams } from "react-router-dom";

const ProfileExperience = () => {
  const { id } = useParams(); // Récupération de l'ID du profil actif
  const [experiences, setExperiences] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExperiences = async () => {
      if (!id) {
        setError("ID du profil manquant");
        return;
      }

      console.log({ profil_id: id });

      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) {
          setError("Token manquant");
          return;
        }

        // Utilisation du bon paramètre pour filtrer par profile.id
        const response = await axios.get(
          `http://localhost:8000/api/experiences?profile.id=${id}`, // Filtrage par profil
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setExperiences(response.data);
        setError("");
      } catch (err) {
        setExperiences([]);
        setError("Erreur lors du chargement des expériences");
      }
    };

    fetchExperiences();
  }, [id]); // Dépendance sur l'ID du profil

  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    return formattedDate.toISOString().split("T")[0]; // Formatée sous le format YYYY-MM-DD
  };

  return (
    <div className="container experience-frame">
      <h2 className="text-center title-h2 display-1">Profile Experiences</h2>
      {error && <p className="text-danger">{error}</p>}
      {experiences.length > 0 ? (
        <div className="gap-4 experience-card">
          {experiences.map((experience, index) => (
            // Ajoute la prop key ici pour chaque élément
            <div
              key={experience.id || `experience-${index}`}
              className="d-flex align-items-center p-3 border rounded shadow-sm card-cadre"
            >
              {/* Vérification de l'existence de l'image associée */}
              <img
                src={experience.images && experience.images[0] ? experience.images[0].url : "/assets/defaultImgageCode.jpg"} 
                alt={experience.compagny}
                className="me-4 rounded-circle" // Style de l'image (arrondie et espacement à gauche)
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <div className="card-info">
                <p>{experience.compagny}</p>
                <span>{experience.role}</span>
                <span>
                  {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                </span>
                <p>{experience.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Aucune expérience trouvée.</p>
      )}
    </div>
  );
};

export default ProfileExperience;
