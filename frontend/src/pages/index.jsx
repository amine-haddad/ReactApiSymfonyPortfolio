import React from "react";
import styles from "../styles/Home.module.css";
import DynamicShapes from "../components/DynamicShapes";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className={styles.homeWrapper}>
      <div className={styles.dynamicBackground}>
        <DynamicShapes />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>Bienvenue sur PortfolioHub</h1>
        <p className={styles.subtitle}>
          🎯 Explorez, créez et partagez vos portfolios.
        </p>

        <div className={styles.descriptionBlock}>
          <p>
            👉 En tant que <strong>visiteur</strong>, vous pouvez consulter les profils publics, leurs projets, leurs expériences, leurs compétences.
          </p>
          <p>
            🧑‍💻 En créant un <strong>compte gratuit</strong>, vous pourrez :
          </p>
          <ul className={styles.features}>
            <li>🗂 Créer plusieurs <strong>profils</strong> (CV, portfolios thématiques…)</li>
            <li>📌 Ajouter des <strong>projets, expériences, compétences</strong></li>
            <li>🎨 Personnaliser vos portfolios et les partager facilement</li>
          </ul>
        </div>

        <div className={styles.buttonGroup}>
          <Link to="/profiles" className={styles.btn}>Explorer les portfolios</Link>
          <Link to="/register" className={styles.btnOutline}>Créer un compte</Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
