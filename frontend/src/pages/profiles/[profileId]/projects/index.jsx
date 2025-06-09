import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../contexts/AuthContext";
import styles from "../../../../styles/ProjectList.module.css";
import PageLayout from "../../../../layouts/PageLayout";
import useProjects from "../../../../hooks/useProjects";
import Spinner from "../../../../components/Spinner";

const ProjectList = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [page, setPage] = useState(1);
  const limit = 10;

  const { projects, total, loading, error } = useProjects(profileId, page, limit);

  if (loading) return <div className={styles["project-message"]}><Spinner /></div>;
  if (error) return <p className="project-error">Erreur : {error}</p>;

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <PageLayout>
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

        {/* Pagination */}
        <div className={styles.pagination} style={{ margin: "2rem 0", display: "flex", gap: "1rem", justifyContent: "center" }}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Précédent
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Suivant
          </button>
        </div>

        <button
          className={styles["back-button"]}
          onClick={() => navigate(`/profiles/${profileId}`)}
        >
          ← Retour au profil
        </button>
      </div>
    </PageLayout>
  );
};

export default ProjectList;
