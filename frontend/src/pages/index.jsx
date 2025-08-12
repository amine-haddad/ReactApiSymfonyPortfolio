import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import PageLayout from "../layouts/PageLayout";
import Spinner from "../components/Spinner";
import Button from "../components/ui/Button";
import styles from "../styles/Home.module.css";
import useProfiles from "../hooks/useProfiles";

const Index = () => {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);

  // Récupère les profils selon l’état de connexion
  const { profiles, loading: profilesLoading } = useProfiles({ mine: !!user });

  // Loading global (auth ou profils)
  if (authLoading || profilesLoading) return <Spinner />;

  // Profils à afficher (max 4)
  const profilesToShow = Array.isArray(profiles)
    ? profiles
      .slice() // pour ne pas muter l'original
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 12)
    : [];

  // Actions selon connexion
  const renderActionButtons = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Button to="/profiles/">Explorer les portfolios</Button>
          <Button to="/register/">Créer un compte</Button>
        </>
      );
    }
    return <Button to="/my/messages/">Voir vos messages</Button>;
  };

  // Grille des profils
  const renderProfileGrid = () => (
    <div className={`row g-5 ${styles.cardGrid}`}>
      {profilesToShow.map(({ id, title, profileSkills, name }) => (
        <div key={id} className="col-md-4">
          <div className={`h-100 ${styles.card} d-flex flex-column`}>
            <h3 className={styles.cardTitle}>{title || "Profil sans nom"}</h3>
            <p className={styles.cardOwner}>{name || "Profil sans nom"}</p>
            {profileSkills?.length > 0 && (
              <div className={styles.skillsList}>
                {profileSkills
                  .slice()
                  .sort((a, b) => b.level - a.level)
                  .map((techno, index) => (
                    <div key={index} className={styles.badge}>
                      {techno.skill.name}
                      {index < 5 ? ` - ${techno.level}%` : ""}
                    </div>
                  ))}
              </div>
            )}
            <div className="mt-auto text-center">
              <Button to={isAuthenticated ? `/my/profiles/${id}` : `/profiles/${id}`}>
                Voir le profil
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <PageLayout>
      <main className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.container}>
            <div className="w-100">
              <h1 className={`text-center text-uppercase ${styles.titleHome}`}>
                PortfolioHub
              </h1>
              <h2 className={`text-center ${styles.subtitle}`}>
                Votre plateforme de portfolios en ligne
              </h2>
              <p className={`text-center ${styles.leadText}`}>
                🎯 Explorez, créez et partagez vos portfolios.
              </p>
              <div className={styles.descriptionBlock}>
                <p className={styles.paragraph}>
                  👉 En tant que <strong>visiteur</strong>, vous pouvez consulter les profils publics,
                  leurs projets, leurs expériences, leurs compétences.
                </p>
                <p className={styles.paragraph}>
                  🧑‍💻 En créant un <strong>compte gratuit</strong>, vous pourrez :
                </p>
                <ul className={styles.features}>
                  <li className={styles.featureItem}>🗂 Créer plusieurs <strong>profils</strong></li>
                  <li className={styles.featureItem}>📌 Ajouter des <strong>projets, expériences, compétences</strong></li>
                  <li className={styles.featureItem}>🎨 Personnaliser vos portfolios et les partager facilement</li>
                </ul>
              </div>
              <div className={`${styles.buttonGroup} justify-content-between`}>
                {renderActionButtons()}
              </div>
              <section className={styles.previewSection}>
                <h2 className={`text-uppercase ${styles.previewTitle}`}>
                  {isAuthenticated ? "Vos 3 derniers portfolios" : "Portfolios récents mis en ligne"}
                </h2>
                {renderProfileGrid()}
              </section>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
};

export default Index;
