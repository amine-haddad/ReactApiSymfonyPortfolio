import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import styles from "../../../../styles/ProjectList.module.css";

const ProjectList = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const id = Number(profileId);
    if (!id || isNaN(id)) {
      setError("ID de profil invalide.");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/profiles/${id}/projects`, {
      headers: { Accept: "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data)
          ? data
          : data["hydra:member"] ?? data.member ?? data.projects ?? [];
        setProjects(items);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) return <p className="project-message">Chargement des projets…</p>;
  if (error) return <p className="project-error">Erreur : {error}</p>;

  return (
    <div className={styles["project-container"]}>

      <header className={styles["project-header"]}>
        <h1 className={styles["project-title"]}>Mes Projets</h1>
        <p className={styles["project-subtitle"]}>
          {user
            ? `Bienvenue, ${user.first_name} ${user.last_name} (${user.email})`
            : "Projets publics du profil"}
        </p>
      </header>

      {projects.length === 0 ? (
        <p className={styles["project-message"]}>Aucun projet trouvé.</p>
      ) : (
        <div className={styles["project-grid"]}>
          {projects.map((project) => (
            <div key={project.id} className={styles["project-card"]}>
              <h3>{project.title || project.name}</h3>
              <p>{project.description ?? "Pas de description disponible."}</p>
              <Link
                to={`/profiles/${profileId}/projects/${project.id}`}
                className={styles["project-link"]}
              >
                Voir le projet →
              </Link>
            </div>
          ))}
        </div>
      )}

      <button
        className={styles["back-button"]}
        onClick={() => navigate(`/profiles/${profileId}`)}
      >
        ← Retour au profil
      </button>

    </div>
  );
};

export default ProjectList;
