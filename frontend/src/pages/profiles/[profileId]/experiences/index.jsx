import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useSingleProfile from "../../../../hooks/useSingleProfile";
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
  const { profile, loading, error } = useSingleProfile(profileId, { forcePublic: true });
  const navigate = useNavigate();

  const experiences = profile?.experiences || [];
  const total = experiences.length;
  const paginatedExperiences = experiences.slice((page - 1) * limit, page * limit);

  if (loading) return <div className={styles.experienceFrame}><Spinner /></div>;
  if (error) return <p className="error">Erreur : {error}</p>;
  if (!profile) return <p className={styles.noData}>Profil non trouvé.</p>;

  return (
    <PageLayout>
      <div className={styles.experienceFrame}>
        <h1 className="text-center">Expériences</h1>
        {paginatedExperiences.length === 0 ? (
          <p className={styles.noData}>Aucune expérience trouvée.</p>
        ) : (
          <div className={styles.experienceGrid}>
            {paginatedExperiences.map(e => (
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
