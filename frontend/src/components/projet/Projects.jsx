import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext"; // Assurez-vous que le chemin est correct

const Projects = () => {
  const { profile, loading, error } = useContext(AuthContext); // Utiliser le profil de l'AuthContext
  const [projects, setProjects] = useState([]);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const [fetchingError, setFetchingError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!profile?.id) {
        setFetchingProjects(false);
        return;
      }

      try {
        // Requête pour obtenir les projets du profil en cours
        const response = await axios.get(`/api/projects?profile_id=${profile.id}`);
        console.log("Réponse API Projets :", response.data.member);
        setProjects(response.data.member); // Assurez-vous que l'API retourne directement la liste des projets
      } catch (err) {
        console.log("API Projets :", response.data.member);
        console.error("Erreur de récupération des projets du profil :", err);
        setFetchingError("Erreur lors du chargement des projets.");
      } finally {
        setFetchingProjects(false);
      }
    };

    fetchProjects();
  }, [profile]); // Relancer la requête quand le profil change

  if (loading || fetchingProjects) {
    return <p>Chargement des projets...</p>;
  }

  if (fetchingError || error) {
    return <p className="text-danger text-center">{fetchingError || error}</p>;
  }

  return (
    <div className="container-fluid section-project">
      <h2 className="text-center mb-2 col-10 mx-auto title-h2 display-1">
        Projets de {profile.name}
      </h2>

      <div className="carousel-wrapper">
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div key={index} className="card project-card col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
              <img
                src={project.image || "/assets/defaultImgageCode.jpg"}
                alt={project.title}
                className="card-img-top project-img-top"
              />
              <div className="card-body project-body">
                <h5 className="card-title project-title">{project.title || "Titre non défini"}</h5>
                <p className="card-text project-text">{project.description}</p>

                {project.technologies?.length > 0 && (
                  <div className="mb-3 card-footer project-footer">
                    <strong>Technologies :</strong>
                    <div className="d-flex flex-wrap gap-1">
                      {project.technologies.map((techno, i) => (
                        <span key={i} className="badge bg-primary text-xs">
                          {techno.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.id && (
                  <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-100">
                    Voir le projet
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">Aucun projet trouvé pour ce profil.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;