import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";
import '../../styles/Profile.css'

function UserProfiles() {
  const { profiles, selectedProfile, selectProfile } = useContext(AuthContext);

  if (!profiles || profiles.length === 0) {
    return <div>Aucun profil trouvé</div>;
  }

  return (
    <div className="user-profile">
      <h1>Liste des Profils</h1>
      <ul>
        {Array.isArray(profiles) &&
          profiles.map((profile) => (
            <li
              key={profile.id}
              className={profile.id === selectedProfile?.id ? "active" : ""}
            >
              <Link
                to={`/profiles/${profile.id}`}
                onClick={() => selectProfile(profile.id)}
              >
                {profile.name}
              </Link>
              {/* Affichage conditionnel des projets */}
              {profile.projects && profile.projects.length > 0 ? (
                <div>
                  <strong>Projets:</strong>
                  <ul>
                    {profile.projects.map((project, index) => (
                      <li key={index}>{project.name}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p>Aucun projet pour ce profil.</p>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default UserProfiles;
