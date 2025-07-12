import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import useProfiles from "../../../hooks/useProfiles";
import PageLayout from "../../../layouts/PageLayout";
import Spinner from "../../../components/Spinner";
import Button from "../../../components/ui/Button";
import style from "../../../styles/ProfilesList.module.css";

function Index() {
  const { user } = useContext(AuthContext);
  const { profiles, loading, error } = useProfiles({ mine: true });

  if (loading)
    return (
      <div className={style.sectionListProfiles}>
        <Spinner />
      </div>
    );

  if (error) return <p className="text-danger">Erreur : {error}</p>;
  if (!user) return <p className="text-warning">Non connecté.</p>;

  return (
    <PageLayout>
      <div className={style.sectionListProfiles}>
        <div className={style.profilesListContainer}>
          <h2 className="h4 fw-bold text-uppercase mb-4">Vos profils</h2>

          {profiles.length === 0 ? (
            <p>Aucun profil trouvé.</p>
          ) : (
            <div className="row g-4">
              {profiles.map((profile) => (
                <div className="col-12 col-md-6 col-lg-4" key={profile.id}>
                  <div className={style.profileCardList}>
                    <h5 className="fw-semibold">{profile.name}</h5>
                    <h6 className="text-muted mb-2">{profile.title}</h6>
                    <p className="flex-grow-1">{profile.bio}</p>
                    <Button to={`/my/profiles/${profile.id}`}>
                      Voir le profil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default Index;
