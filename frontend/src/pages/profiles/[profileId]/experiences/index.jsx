import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useExperience from "../../../../hooks/useExperience";
import PageLayout from "../../../../layouts/PageLayout";
import styles from "../../../../styles/ExperienceList.module.css";
import Spinner from "../../../../components/Spinner";

const formatDate = (isoDate) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Date(isoDate).toLocaleDateString('fr-FR', options);
};

const ExperienceList = () => {
  const { profileId } = useParams();
  const [page, setPage] = useState(1);
  const limit = 10;
  const { experiences, total, loading, error } = useExperience(profileId, page, limit);
  const navigate = useNavigate();

  if (loading) return <p className={styles.loading}><Spinner /></p>;
  if (error) return <p className={styles.error}>Erreur : {error}</p>;

  return (
    <PageLayout>
      <div className={styles.experienceFrame}>
        <h1 className="text-center">Expériences</h1>

        {experiences.length === 0 ? (
          <p className={styles.noData}>Aucune expérience trouvée.</p>
        ) : (
          <div className={styles.experienceGrid}>
            {experiences.map(e => (
              <div className={styles.experienceCard} key={e.id}>
                <h3 className={styles.experienceTitle}>{e.role || "Titre non renseigné"}</h3>
                <p className={styles.experienceRole}>
                  {(`company: ${e.compagny}` || "Entreprise non renseignée")}<br />
                  {e.startDate ? formatDate(e.startDate) : "Date début inconnue"} – {e.endDate ? formatDate(e.endDate) : "Date fin inconnue"}
                </p>
                <p className={styles.experienceDescription}>{e.description || "Description non renseignée"}</p>
                <Link
                  to={`/profiles/${profileId}/experiences/${e.id ?? ''}`}
                  className={styles.experienceLink}
                >
                  {e.role || "Sans nom"}
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Précédent
          </button>
          <span>
            Page {page} / {Math.max(1, Math.ceil(total / limit))}
          </span>
          <button
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage(page + 1)}
          >
            Suivant
          </button>
        </div>

        <button
          className={styles["back-button"]}
          onClick={() => navigate(`/profiles/${profileId}`)}
        >
          ← Retour au profil
        </button>
      </div>
    </PageLayout>
  );
};

export default ExperienceList;
