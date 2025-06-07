import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import styles from "../../../styles/ProfilesList.module.css"; // Assurez-vous que le chemin est correct

function Index() {
  const { user, profiles, loading, error, selectProfile } = useContext(AuthContext);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!user) return <p>Non connecté.</p>;

  return (
    <div className="container-fluid section-listProfiles" >
      <h2 className="mb-4">Vos profils</h2>
      <div className="profilesListe-container">
        <div className="row">
          {user.userProfiles && user.userProfiles.map(profile => (
            <div className="col-md-4 mb-4" key={profile.id}>
              <div className="profile-card-list">
                <div className="card-body d-flex flex-column h-100">
                  <h5 className="card-title">{profile.name}</h5>
                  <h6 className="card-subtitle">{profile.title}</h6>
                  <p className="card-text">{profile.bio}</p>
                  <Link
                    to={`/my/profiles/${profile.id}`}
                    className="btn btn-primary mt-auto"
                    onClick={() => selectProfile(profile.id)}
                  >
                    Voir le profil
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div >
  );
}

export default Index;
