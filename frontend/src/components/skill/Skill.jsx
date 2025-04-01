// Composant Skill
import React from "react";
import "../../styles/Skill.css";

const Skill = ({ skills }) => {
  if (!skills?.length) {
    return <p>Aucune compétence trouvée.</p>;
  }

  return (
    <div className="SkillFrame">
    <h2 className="display-1 title-h2">Skills</h2>
    <div className="skills-container">
      {skills.map((skill) => (
        <a
          key={skill.id || skill.name} // Utiliser `id` si dispo, sinon `name`
          href={`/skills/${skill.id || skill.name}`} // Lien vers la compétence
          className="skill-medallion-link" // Ajouter une classe pour les liens
        >
          <div
            className="skill-medallion"
            style={{
              backgroundImage: `conic-gradient(rgba(101, 119, 253, 0.61) 0% ${skill.level}%, rgba(244, 237, 212, 0.75) ${skill.level}% 100%)`,
            }}
          >
            <img
              src={skill.image || "/assets/defaultImgageCode.jpg"} // Image dynamique
              alt={skill.name}
              className="skill-image"
            />
            <p>{skill.name}</p>
            <span>{skill.level}%</span>
          </div>
        </a>
      ))}
    </div>
  </div>
  );
};

export default Skill;
