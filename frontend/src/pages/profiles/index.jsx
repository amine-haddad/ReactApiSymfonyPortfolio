import { useProfiles } from "../../hooks/useProfiles";
import { Link } from "react-router-dom";
import styles from "../../styles/ProfilesList.module.css";
import PageLayout from "../../layouts/PageLayout";

function Index() {
  const { profiles, loading, error } = useProfiles("public");

  if (loading) return <p>Chargement...</p>;

  return (
    <PageLayout>
      <div className={styles.sectionListProfiles}>
        <h1 className="mb-4">Portfolios</h1>
        <div className="row">
          {profiles.length > 0 ? (
            profiles.map((profile) => (
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
    </PageLayout>
  );
}

export default Index;
