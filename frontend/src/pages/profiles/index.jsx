import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import styles from "../../styles/ProfilesList.module.css";

function Index() {
  const { publicProfiles, loading } = useContext(AuthContext);

  if (loading) return <p>Chargement...</p>;

  return (
    <div className={styles.sectionListProfiles}>
      <h1 className="mb-4">Portfolios</h1>

      {/* Tu peux garder les classes Bootstrap comme 'row' et 'col-md-4 mb-4' */}
      <div className="row">
        {publicProfiles.length > 0 ? (
          publicProfiles.map((profile) => (
            <div className="col-md-4 mb-4" key={profile.id}>
              <div className={styles.profileCardList}>
                <div className="card-body d-flex flex-column h-100">
                  <h5 className="card-title">{profile.name}</h5>
                  <h6 className="card-subtitle">{profile.title}</h6>
                  <p className="card-text">{profile.bio}</p>
                  <Link to={`/profiles/${profile.id}`} className="btn mt-auto">
                    Voir le profil
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun profil public trouvé.</p>
        )}
      </div>
    </div>
  );
}

export default Index;
