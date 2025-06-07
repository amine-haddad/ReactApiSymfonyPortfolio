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

  const imageUrl = experience.images?.[0]?.url || "/assets/defaultImgageCode.jpg";

  const formatDate = (dateStr) => {
    if (!dateStr) return "Date non renseignée";
    const date = new Date(dateStr);
    return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long" });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{experience.role || "Titre non renseigné"}</h1>

      <img
        src={imageUrl}
        alt={`Illustration de l'expérience ${experience.image}`}
        style={{
          width: "100%",
          height: "auto",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          marginBottom: "1rem"
        }}
      />

      <p className={styles.meta}>
        <span className={styles.label}>Employeur:</span> {experience.compagny || "Aucune entreprise fournie."}
      </p>

      <p className={styles.description}>
        <div className={styles.label}>Descriptif :</div>
        {experience.description || "Aucune description fournie."}
      </p>
      <p className={styles.meta}>
        <span className={styles.label}>Début :</span> {formatDate(experience.startDate)}
      </p>
      <p className={styles.meta}>
        <span className={styles.label}>Fin :</span>{" "}
        {experience.endDate ? formatDate(experience.endDate) : "En cours"}
      </p>

      <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
        <Link to={`/profiles/${profileId}/experiences`} className={styles.backLink}>
          ← Retour aux expériences
        </Link>
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.backLink}
        >
          Voir l’image
        </a>
      </div>
    </div>
  );
};

export default ExperienceId;
