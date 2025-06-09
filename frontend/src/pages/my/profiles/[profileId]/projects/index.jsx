import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../../../contexts/AuthContext";
import styles from "../../../../../styles/ProjectList.module.css";
import PageLayout from "../../../../../layouts/PageLayout";
import useProjects from "../../../../../hooks/useProjects";
import Spinner from "../../../../../components/Spinner";

const ProjectList = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { loading: authLoading, user, isAuthenticated } = useContext(AuthContext);

  // Utilisation du hook centralisé avec authentification
  const { projects, loading, error } = useProjects(profileId, true);

  if (loading || authLoading) return <div className={styles["project-message"]}><Spinner /></div>;
  if (error) return <p className={styles["project-error"]}>Erreur : {error}</p>;

  return (
    <PageLayout>
      <div className={styles["project-header"]}>
        <header className={styles["project-header"]}>
          <h1 className={styles["project-title"]}>Mes Projets</h1>
          <p className={styles["project-subtitle"]}>
            Bienvenue, {user.first_name} {user.last_name} ({user.email})
          </p>
        </header>

        {projects.length === 0 ? (
          <p className={styles["project-message"]}>Aucun projet trouvé.</p>
        ) : (
          <div className={styles["project-grid"]}>
            {projects.map(project => (
              <div key={project.id} className={styles["project-card"]}>
                <h3>{project.title || project.name}</h3>
                <p>{project.description ?? "Pas de description disponible."}</p>
                <Link
                  to={`/my/profiles/${profileId}/projects/${project.id}`}
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
          onClick={() => navigate(`/my/profiles/${profileId}`)}
        >
          ← Retour au profil
        </button>
      </div>
    </PageLayout>
  );
};

export default ProjectList;
