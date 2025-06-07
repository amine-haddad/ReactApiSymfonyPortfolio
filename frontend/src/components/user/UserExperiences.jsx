import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

function UserExperiences() {
  const { isAuthenticated, user, profiles, activeProfile, loading, error } = useContext(AuthContext);
  return (
    <div className="user-profile">
      <h1>Liste des composants Expériences</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>
            <h3>{profile.name}</h3> {/* Affichage du nom du profil */}
            {/* Vérifier si le profil a des projets */}
            {profile.experiences && profile.experiences.length > 0 ? (
              <ul>
                <span>--------------------------------------</span>
                {profile.experiences.map((experience) => (
                  <li key={experience.id}>
                    Experience: {experience.id}. Rôle: {experience.role}.
                    Company: {experience.compagny}- Debut:{" "}
                    {experience.start_date}- Fin: {experience.end_date}-
                    Descriptif: {experience.description}- Slug:{" "}
                    {experience.slug}- Images: {experience.images}
                  </li>
                ))}

                <span>-------------------------------------</span>
              </ul>
            ) : (
              <p>Aucun projet trouvé.</p> // Message si pas de projets
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserExperiences;
