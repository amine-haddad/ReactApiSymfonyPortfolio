import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

function UserSkills() {
  const { isAuthenticated, user, profiles, activeProfile, loading, error } = useContext(AuthContext);
  return (
    <div className="user-profile">
      <h1>Liste des skills des utilisateurs</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>
            <h3>{profile.name}</h3> {/* Nom du profil */}
            {profile.profileSkills && profile.profileSkills.length > 0 ? (
             <ul>
             {profile.profileSkills.map((skill, index) => (
               <li key={`${skill.id}-${index}`}>
                 {skill.skill.name} - {skill.level} {/* Nom du skill */}
               </li>
             ))}
           </ul>
            ) : (
              <p>Aucun skill trouvé.</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserSkills;
