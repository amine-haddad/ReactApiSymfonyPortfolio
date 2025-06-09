import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import PageLayout from "../layouts/PageLayout";
import styles from "../styles/Home.module.css";
import Spinner from "../components/Spinner";

const Index = () => {
  const { publicProfiles, loading } = useContext(AuthContext);

  if (loading) return <Spinner />;

  const latestProfiles = publicProfiles
    .slice()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  return (
    <PageLayout>
      <h1 className={styles.title}>Bienvenue sur PortfolioHub</h1>
      <p className={styles.subtitle}>🎯 Explorez, créez et partagez vos portfolios.</p>

      <div className={styles.descriptionBlock}>
        <p>
          👉 En tant que <strong>visiteur</strong>, vous pouvez consulter les
          profils publics, leurs projets, leurs expériences, leurs compétences.
        </p>
        <p>🧑‍💻 En créant un <strong>compte gratuit</strong>, vous pourrez :</p>
        <ul className={styles.features}>
          <li>🗂 Créer plusieurs <strong>profils</strong></li>
          <li>📌 Ajouter des <strong>projets, expériences, compétences</strong></li>
          <li>🎨 Personnaliser vos portfolios et les partager facilement</li>
        </ul>
      </div>

      <div className={styles.buttonGroup}>
        <Link to="/profiles" className={styles.btn}>Explorer les portfolios</Link>
        <Link to="/register" className={styles.btnOutline}>Créer un compte</Link>
      </div>

      <div className={styles.previewSection}>
        <h2 className={styles.previewTitle}>Portfolios récents mis en ligne</h2>
        <div className={styles.cardGrid}>
          {latestProfiles.map((profile) => (
            <div key={profile.id} className={styles.card}>
              <h3>{profile.title || "Profil sans nom"}</h3>
              {profile.profileSkills?.length > 0 && (
                <div className={styles.skillsList}>
                  {profile.profileSkills.map((techno, index) => (
                    <span key={index} className={styles.skillItem}>
                      {techno.skill.name}: {techno.level}%
                      {index < profile.profileSkills.length - 1 ? (
                        <span>, </span>
                      ) : (
                        <span> ... </span>
                      )}
                    </span>
                  ))}
                </div>
              )}
              <Link to={`/profiles/${profile.id}`} className={styles.cardLink}>
                Voir le profil
              </Link>
            </div>
          ))}
          {latestProfiles.length === 0 && (
            <p style={{ color: "#ccc" }}>
              Aucun portfolio public n’a encore été publié.
            </p>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
