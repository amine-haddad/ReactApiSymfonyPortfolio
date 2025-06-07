import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import styles from "../../styles/Skill.module.css";

const ProfileSkills = ({ skills, error }) => {
  if (!skills || skills.length === 0) {
    return <p>Aucune compétence trouvée.</p>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.skillFrame}>
      <h2 className={`display-1 ${styles.titleH2}`}>Skills</h2>
      <div className={styles.skillsContainer}>
        {skills.map((skill, index) => (
          <a
            key={skill.id || `${skill.name}-${index}`}
            href={`/skills/${skill.id || skill.name}`}
            className={styles.skillMedallionLink}
          >
            <div
              className={styles.skillMedallion}
              style={{
                backgroundImage: `conic-gradient(rgba(101, 119, 253, 0.61) 0% ${skill.level}%, rgba(244, 237, 212, 0.75) ${skill.level}% 100%)`,
              }}
            >
              <img
                src={skill.image || "/assets/defaultImgageCode.jpg"}
                alt={skill.name}
                className={styles.skillImage}
              />
              <p className={styles.skillName}>{skill.skill.name}</p>
              <span className={styles.skillLevel}>{skill.level}%</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProfileSkills;
