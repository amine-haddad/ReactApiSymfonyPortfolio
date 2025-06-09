import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext } from "react";

function User() {
  const { user, profiles, activeProfile, loading, error } = useContext(AuthContext);

  // Si les données sont en cours de chargement, on affiche un message de chargement.
  if (loading) return <p>Chargement...</p>;

  // Si une erreur survient, on l'affiche.
  if (error) return <p>Erreur : {error}</p>;

  // Si l'utilisateur n'est pas authentifié (pas de `user`), on affiche un message.
  if (!user) return <p>Vous devez être connecté pour voir cette page.</p>;

  return (
    <div className="user-profile">
      <h1>{user.first_name} {user.last_name}</h1>
      <p>Email : {user.email}</p>
      <p>Firstname : {user.first_name}</p>
      <p>Lastname : {user.last_name}</p>

      {/* Affiche les profils de l'utilisateur si disponibles */}
      {user.userProfiles && (
        <ul>
          {user.userProfiles.map((profile) => (
            <li key={profile.id}>
              <Link to={`/my/profiles/${profile.id}`}>{profile.name}</Link>

              <p>Titre du profil : {profile.title}</p>
              <p>Bio du profil : {profile.bio}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default User;
