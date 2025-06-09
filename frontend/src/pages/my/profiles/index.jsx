import { useContext } from "react";
import { useProfiles } from "../../../hooks/useProfiles";
import { Link } from "react-router-dom";
import styles from "../../../styles/ProfilesList.module.css"; // Assurez-vous que le chemin est correct
import PageLayout from "../../../layouts/PageLayout";
import Spinner from "../../../components/Spinner";

function Index() {
  const { profiles, loading, error, user, selectProfile } = useProfiles("private");

  if (loading) return <div className={styles.sectionListProfiles}><Spinner /></div>;
  if (error) return <p>Erreur : {error}</p>;
  if (!user) return <p>Non connecté.</p>;

  return (
    <PageLayout>
      <div className={styles.sectionListProfiles}>
        <h2 className="mb-4">Vos profils</h2>

        {profiles.length === 0 ? (
          <p>Aucun profil trouvé.</p>
        ) : (
          <div className="row">
            {profiles.map((profile) => (
              <div className="col-md-4 mb-4" key={profile.id}>
                <div className={styles.profileCardList}>
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
        )}
      </div>
    </PageLayout>
  );
}

export default Index;
