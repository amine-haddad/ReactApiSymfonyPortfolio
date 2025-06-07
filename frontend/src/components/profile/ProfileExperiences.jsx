import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "../../styles/Experience.module.css";

const ProfileExperiences = ({ experiences, error }) => {
  if (!experiences || experiences.length === 0) {
    return (
      <div className={styles.experienceFrame}>
        <h2 className="text-center title-h2 display-1">Expériences</h2>
        <p className="text-center mt-4">Aucune expérience trouvée.</p>
      </div>
    );
  }

  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    return formattedDate.toISOString().split("T")[0];
  };

  return (
    <div className={styles.experienceFrame}>
      <h2 className="text-center title-h2 display-1">Expériences</h2>
      {error && <p className="text-danger">{error}</p>}

      {experiences.map((experience, index) => (
        <div className={styles.experienceCardContainer} key={experience.id || index}>
          <div className={`${styles.experienceCard} ${styles.cardFrame}`}>
            <div className="d-flex align-items-center">
              <img
                src={
                  experience.images && experience.images[0]
                    ? experience.images[0].url
                    : "/assets/defaultImgageCode.jpg"
                }
                alt={experience.compagny}
                className="me-4 rounded-circle"
              />
              <div className={styles.cardInfo}>
                <p className="fw-bold mb-1">{experience.compagny}</p>
                <span className="d-block mb-1">{experience.role}</span>
                <span className="d-block mb-2">
                  {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                </span>
                <p className="mb-0">{experience.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProfileExperiences;
