import { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import useProfiles from "../../../hooks/useProfiles";
import PageLayout from "../../../layouts/PageLayout";
import Spinner from "../../../components/Spinner";
import Button from "../../../components/ui/Button";
import style from "../../../styles/ProfilesList.module.css";

function Index() {
  const { user } = useContext(AuthContext);
  const { profiles, loading, error } = useProfiles();

  if (loading)
    return (
      <div className={style.sectionListProfiles}>
        <Spinner />
      </div>
    );

  if (error) return <p className="text-danger">Erreur : {error}</p>;
  if (!user) return <p className="text-warning">Non connecté.</p>;

  const userProfiles = profiles.filter((profile) => profile.user === user.id);

  return (
    <PageLayout>
      <div className={style.sectionListProfiles}>
        <div className={style.profilesListContainer}>
          <h2 className="h4 fw-bold text-uppercase mb-4 titlePortfoliohub">Vos profils</h2>

          {userProfiles.length === 0 ? (
            <p>Aucun profil trouvé.</p>
          ) : (
            <div className={userProfiles.length === 1 ? style.singleCardRow : style.row}>
              {userProfiles.map((profile) => {
                const sortedSkills = [...(profile.profileSkills || [])].sort((a, b) => b.level - a.level);
                return (
                  <div className={style.colLg4} key={profile.id}>
                    <div className={style.profileCardList}>
                      <h5 className={`${style.profileName} fw-bold mb-1`}>{profile.name}</h5>
                      <h6 className={`${style.profileTitle} mb-2 fst-italic`}>{profile.title}</h6>
                      <p className="flex-grow-1">{profile.bio}</p>
                      {sortedSkills.length > 0 && (
                        <div className="mb-2 d-flex flex-wrap gap-1">
                          {sortedSkills.map((skillObj, j) => (
                            <span
                              key={j}
                              className="badge rounded-pill"
                              style={{
                                background: "var(--accent-color)",
                                color: "#fff",
                                fontWeight: 500,
                                fontSize: "0.95em",
                              }}
                              title={`Niveau : ${skillObj.level}`}
                            >
                              {skillObj.skill?.name}
                              {skillObj.level ? <span style={{ opacity: 0.7 }}> ({skillObj.level}%)</span> : ""}
                            </span>
                          ))}
                        </div>
                      )}
                      <Button to={`/my/profiles/${profile.id}`} className="mt-3">
                        Voir le profil
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default Index;
