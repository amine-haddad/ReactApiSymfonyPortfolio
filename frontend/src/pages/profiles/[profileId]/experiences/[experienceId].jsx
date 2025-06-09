import { useParams, Link } from "react-router-dom";
import useSingleExperience from "../../../../hooks/useSingleExperience";
import PageLayout from "../../../../layouts/PageLayout";
import styles from "../../../../styles/ExperienceId.module.css";

const ExperienceId = () => {
  const { profileId, experienceId } = useParams();
  const { experience, loading, error } = useSingleExperience(profileId, experienceId);

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
    <PageLayout>
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

        <div className={styles.description}>
          <div className={styles.label}>Descriptif :</div>
          <p>{experience.description || "Aucune description fournie."}</p>
        </div>
        <p className={styles.meta}>
          <span className={styles.label}>Début :</span> {formatDate(experience.start_date)}
        </p>
        <p className={styles.meta}>
          <span className={styles.label}>Fin :</span>{" "}
          {experience.end_date ? formatDate(experience.end_date) : "En cours"}
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
    </PageLayout>
  );
};

export default ExperienceId;
