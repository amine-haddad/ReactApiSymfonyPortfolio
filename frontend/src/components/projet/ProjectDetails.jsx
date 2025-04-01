import { useState, useEffect } from "react";
import { fetchData } from "../../services/apiService"; // Ton service API

const ProjectDetails = ({ projectId }) => {
  const [projectDetails, setProjectDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetchData(`/projects/${projectId}`); // Récupère les détails du projet par ID
        setProjectDetails(response); // Stocke les détails dans le state
        setErrorMessage(""); // Réinitialise l'erreur
      } catch (err) {
        setProjectDetails(null);
        setErrorMessage("Erreur lors du chargement des détails du projet");
      }
    };

    if (projectId) {
      fetchProjectDetails();
    }
  }, [projectId]);

  return (
    <div className="project-details">
      {errorMessage && <p className="text-danger">{errorMessage}</p>}
      {projectDetails ? (
        <div className="project-details-content">
          <h3>{projectDetails.title}</h3>
          <p>{projectDetails.description}</p>
          {/* Plus de détails ici */}
        </div>
      ) : (
        <p>Chargement des détails...</p>
      )}
    </div>
  );
};

export default ProjectDetails;
