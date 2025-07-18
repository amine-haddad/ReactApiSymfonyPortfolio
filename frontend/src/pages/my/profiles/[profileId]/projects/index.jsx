import { useParams, Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../../contexts/AuthContext";
import useProfiles from "../../../../../hooks/useProfiles";
import styles from "../../../../../styles/ProjectList.module.css";
import PageLayout from "../../../../../layouts/PageLayout";
import Spinner from "../../../../../components/Spinner";

const ProjectList = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [page, setPage] = useState(1);
  const limit = 10;

  // Utilise useProfiles pour récupérer les profils de l'utilisateur connecté
  const { profiles, loading, error } = useProfiles({ mine: true });

  const profile = profiles.find((p) => String(p.id) === String(profileId));
  const projects = profile?.projects || [];
  const total = projects.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const paginatedProjects = projects.slice((page - 1) * limit, page * limit);

  if (loading || authLoading) return <div className={styles["project-message"]}><Spinner /></div>;
  if (error) return <p className={styles["project-error"]}>Erreur : {error}</p>;
  if (!profile) return <p className={styles["project-message"]}>Profil non trouvé.</p>;

  return (
    <PageLayout>
      <div className={styles["project-header"]}>
        <header className={styles["project-header"]}>
          <h1 className={styles["project-title"]}>Mes Projets</h1>
          <p className={styles["project-subtitle"]}>
            Bienvenue, {user.first_name} {user.last_name} ({user.email})
          </p>
        </header>

        {paginatedProjects.length === 0 ? (
          <p className={styles["project-message"]}>Aucun projet trouvé.</p>
        ) : (
          <div className={styles["project-grid"]}>
            {paginatedProjects.map(project => (
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
          onClick={() => navigate(`/my/profiles/${profileId}`)}
        >
          ← Retour au profil
        </button>
      </div>
    </PageLayout>
  );
};

export default ProjectList;
