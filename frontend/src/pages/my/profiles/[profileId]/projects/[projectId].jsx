// src/pages/profiles/[profileId]/projects/[projectId].jsx
import { useParams, Link } from "react-router-dom";
import DynamicShapes from "../../../../../components/DynamicShapes";
import Spinner from "../../../../../components/Spinner";
import styles from "../../../../../styles/ProjectDetail.module.css";
import useSingleProject from "../../../../../hooks/useSingleProject";

const ProjectDetail = () => {
  const { profileId, projectId } = useParams();
  const { project, loading, error } = useSingleProject(profileId, projectId);

  // Fonction utilitaire pour formater la date
  const formatDate = (dateStr) => {
    if (!dateStr) return "Non renseignée";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) return <div className={styles.container}><Spinner /></div>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!project) return <p className={styles.notFound}>Projet introuvable.</p>;

  const imageUrl = project.image || "/assets/clavierFondBleuter.jpeg";
  return (
    <div className={styles.pageContainer}>
      <div className={styles.dynamicBackground}>
        <DynamicShapes />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>{project.title}</h1>
          <img
            src={imageUrl}
            alt={`Illustration du projet ${project.title}`}
            className={styles.image}
          />
          <p className={styles.meta}>
            <span className={styles.label}>Description :</span> {project.description}
          </p>
          <p className={styles.meta}>
            <span className={styles.label}>Date :</span> {formatDate(project.date)}
          </p>
          <p className={styles.meta}>
            <span className={styles.label}>Technologies :</span>{" "}
            {project.technologies?.map(t => t.name).join(", ") || "Non renseignées"}
          </p>
          <Link to={`/my/profiles/${profileId}/projects`} className={styles.backLink}>
            ← Retour aux projets
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
