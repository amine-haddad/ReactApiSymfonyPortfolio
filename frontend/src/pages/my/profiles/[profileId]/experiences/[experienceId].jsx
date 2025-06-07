import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../../../../styles/ExperienceId.module.css";

const ExperienceId = () => {
  const { profileId, experienceId } = useParams();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await fetch(`/api/profiles/${profileId}/experiences/${experienceId}`);
        if (!res.ok) throw new Error("Erreur lors du chargement de l'expérience.");
        const data = await res.json();
        setExperience(data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
        setError("Une erreur est survenue lors du chargement de l'expérience.");
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [profileId, experienceId]);

  if (loading) return <div className={styles.spinner}></div>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!experience) return <p className={styles.notFound}>Expérience introuvable.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{experience.title || "Titre non renseigné"}</h1>
      <p className={styles.meta}>
        <span className={styles.label}>ID Profil :</span> {profileId}
      </p>
      <p className={styles.meta}>
        <span className={styles.label}>ID Expérience :</span> {experienceId}
      </p>
      <p className={styles.description}>
        {experience.description || "Aucune description fournie."}
      </p>

      <Link to={`/profiles/${profileId}/experiences`} className={styles.backLink}>
        ← Retour à la liste des expériences
      </Link>
    </div>
  );
};

export default ExperienceId;
