import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../../contexts/AuthContext";
import "../../../../../styles/ProjectList.css";

const ProjectList = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { loading: authLoading, user, isAuthenticated } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !isAuthenticated || !profileId) return;

    const token = localStorage.getItem("jwt_token");
    if (!token) {
      setError("Vous devez être connecté pour voir ces projets.");
      setLoading(false);
      return;
    }

    fetch(`/api/profiles/${profileId}/projects`, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const items = Array.isArray(data)
          ? data
          : data["hydra:member"] ?? data.member ?? data.projects ?? [];
        setProjects(items);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [profileId, authLoading, isAuthenticated]);

  console.log('useEffect déclenché');

  if (loading || authLoading) return <p className="project-message">Chargement des projets…</p>;
  if (error) return <p className="project-error">Erreur : {error}</p>;

  return (
    <div className="project-container">
      <header className="project-header">
        <h1 className="project-title">Mes Projets</h1>
        <p className="project-subtitle">Bienvenue, {user.first_name} {user.last_name} ({user.email})</p>
      </header>

      {projects.length === 0 ? (
        <p className="project-message">Aucun projet trouvé.</p>
      ) : (
        <div className="project-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <h3>{project.title || project.name}</h3>
              <p>{project.description ?? "Pas de description disponible."}</p>
              <Link to={`/profiles/${profileId}/projects/${project.id}`} className="project-link">
                Voir le projet →
              </Link>
            </div>
          ))}
        </div>
      )}

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Retour
      </button>
    </div>
  );
};

export default ProjectList;
