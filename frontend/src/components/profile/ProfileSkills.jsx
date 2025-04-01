import React from "react";
import "../../styles/Skill.css";

const ProfileSkills = ({ profile, error }) => {
    console.log('hallo',profile)
  if (!profile.profileSkills?.length) {
    return <p>Aucune compétence trouvéeee.</p>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Chargement...</div>;
  }
 console.log({skillprof:profile.profileSkills})
  return (
    <div className="SkillFrame">
    <h2 className="display-1 title-h2">Skills</h2>
    <div className="skills-container">
      {profile.profileSkills.map((skill,index) => (
        <a
          key={skill.id || `${skill.name}-${index}`} // Utiliser `id` si dispo, sinon `name`
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
            {console.log("Profile Skills Data:", profile.profileSkills)}
            <p key={`${skill.id}-p`}>{skill.name}</p>
            <span>{skill.level}%</span>

          </div>
        </a>
      ))}
    </div>
  </div>
  );
};
export default ProfileSkills;