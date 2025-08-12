import { useState, useEffect } from "react";
import useProfiles from "../../hooks/useProfiles";
import PageLayout from "../../layouts/PageLayout";
import Spinner from "../../components/Spinner";
import style from "../../styles/ProfilesList.module.css";
import AsideMenu from "../../components/AsideMenu";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

function Index() {
  // On récupère tous les profils (mine: false pour visiteurs)
  const { profiles, loading, error } = useProfiles({ mine: false });

  const [globalFilter, setGlobalFilter] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filter = globalFilter.toLowerCase();

  // Recherche par compétence ou titre
  const isSkillSearch = profiles?.some((p) =>
    p.profileSkills?.some((s) => s.skill.name.toLowerCase().includes(filter))
  ) || false;

  const filteredProfiles = profiles?.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(filter);
    const titleMatch = p.title.toLowerCase().includes(filter);
    const skillMatch = p.profileSkills?.some((skill) =>
      skill.skill.name.toLowerCase().includes(filter)
    );
    return nameMatch || titleMatch || skillMatch;
  });

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  if (loading) {
    return (
      <PageLayout>
        <div className={style.sectionListProfiles}>
          <Spinner />
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <div className={`${style.sectionListProfiles} text-danger`}>
          Erreur : {error}
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {/* Bouton retour en haut de page */}
      <Link to="/"

        className="btn btn-outline-primary mb-3 ms-2"
        style={{
          backgroundColor: "var(--buton-bg)",
          color: "var(--text-color)",
          borderColor: "var(--accent-color)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--button-bg-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--buton-bg)")
        }
      >
        ← Retour à l'accueil
      </Link>
      {/* Menu Burger pour petits écrans */}
      <button
        className={`btn btn-outline-dark mb-3 ms-2 ${style.burgerButton}`}
        style={{
          backgroundColor: "var(--buton-bg)",
          color: "var(--text-color)",
          borderColor: "var(--accent-color)",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--button-bg-hover)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = "var(--buton-bg)")
        }
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Ouvrir le menu"
      >
        Filtrez votre recherche
      </button>
      <AsideMenu
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onSearch={setGlobalFilter}
      />
      <section className={`${style.sectionListProfiles} d-flex gap-4`}>
        <div className={`${style.profilesListContainer} flex-grow-1`}>
          <h2 className="display-6 fw-bold text-uppercase mb-4 text-center titlePortfoliohub">
            PortfolioHub
          </h2>
          {filteredProfiles.length === 0 ? (
            <p className="lead text-center">Aucun profil trouvé.</p>
          ) : (
            <div className="row g-4">
              {filteredProfiles.map((profile) => {
                const sortedSkills = [...(profile.profileSkills || [])].sort(
                  (a, b) => b.level - a.level
                );
                return (
                  <div className="col-12 col-md-6 col-lg-4" key={profile.id}>
                    <div className={style.profileCardList}>
                      <h5 className={`${style.profileName} fw-bold mb-1`}>
                        {profile.name}
                      </h5>
                      <h6 className={`${style.profileTitle} mb-2 fst-italic`}>
                        {profile.title}
                      </h6>
                      {!isSkillSearch && <p>{profile.bio}</p>}
                      {(isSkillSearch || sortedSkills.length > 0) && (
                        <ul className="list-unstyled mt-2 mb-0">
                          {sortedSkills.map((skillObj, j) => (
                            <li
                              key={j}
                              className="badge bg-secondary me-1"
                              title={`Niveau : ${skillObj.level}`}
                            >
                              {skillObj.skill.name}
                            </li>
                          ))}
                        </ul>
                      )}
                      {/* Bouton pour voir le profil */}
                      <Button to={`/profiles/${profile.id}`} className="mt-3">
                        Voir le profil
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
}

export default Index;
