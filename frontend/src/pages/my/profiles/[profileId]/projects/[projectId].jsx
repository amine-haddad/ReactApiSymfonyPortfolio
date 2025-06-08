// src/pages/profiles/[profileId]/projects/[projectId].jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DynamicShapes from "../../../../../components/DynamicShapes"; // adapte le chemin selon ton arborescence
import styles from "../../../../../styles/ProjectDetail.module.css";

const ProjectDetail = () => {
  const { profileId, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/profiles/${profileId}/projects/${projectId}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur de chargement du projet :", err);
        setLoading(false);
      });
  }, [profileId, projectId]);

  if (loading) return <div className={styles.spinner}></div>;
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
            <span className={styles.label}>Date :</span> {project.date || "Non renseignée"}
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
