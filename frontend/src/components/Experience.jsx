import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Experience.css'

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const response = await axios.get("http://localhost:8000/api/experiences", {
                    headers: { Accept: "application/json" },
                });
                
                setExperiences(response.data);
                setError(""); // Réinitialisation de l'erreur
            } catch (err) {
                setExperiences([]);
                setError("Erreur lors du chargement des expériences");
            }
        };
        fetchExperiences();
    }, []);

    const formatDate = (date) => {
        if (!date) return "";
        const formattedDate = new Date(date);
        return formattedDate.toISOString().split("T")[0]; // Formatée sous le format YYYY-MM-DD
    };

    return (
        <div className="container experience-frame">
            <h2 className="text-center title-h2 display-1">Experiences</h2>
            {error && <p className="text-danger">{error}</p>}
            {experiences.length > 0 ? (
                <div className=" gap-4 experience-card">
                    {experiences.map((experience, index) => (
                        // Ajoute la prop key ici pour chaque élément
                        <div key={experience.id|| `experience-${index}`} className="d-flex align-items-center p-3 border rounded shadow-sm card-cadre">
                            <img
                                src={experience.image || "/assets/defaultImgageCode.jpg"} // Remplace par l'URL de l'image
                                alt={experience.compagny}
                                className="me-4 rounded-circle" // Style de l'image (arrondie et espacement à gauche)
                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            />
                            <div className="card-info">
                                <p className="">{experience.compagny}</p>
                                <span className=" ">{experience.role}</span>
                                <span className="">{formatDate(experience.startDate)}-{formatDate(experience.endDate)}</span>
                                <p className="">{experience.description}</p>
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

export default Experience;
