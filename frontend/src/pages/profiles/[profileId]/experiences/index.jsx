import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageLayout from "../../../../layouts/PageLayout";
import styles from "../../../../styles/ExperienceList.module.css";

const formatDate = (isoDate) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Date(isoDate).toLocaleDateString('fr-FR', options);
};

const ExperienceList = () => {
  const { profileId } = useParams();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`/api/profiles/${profileId}/experiences`, {
      headers: { "Accept": "application/json" },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        const items = Array.isArray(data)
          ? data
          : data["hydra:member"] ?? data.member ?? data.experiences ?? [];
        setExperiences(items);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [profileId]);

  if (loading) return <p className={styles.loading}>Chargement des expériences…</p>;
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
                  {e.start_date ? formatDate(e.start_date) : "Date début inconnue"} – {e.end_date ? formatDate(e.end_date) : "Date fin inconnue"}
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
