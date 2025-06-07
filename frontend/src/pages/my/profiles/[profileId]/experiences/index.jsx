import React from 'react';
import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import styles from "../../../../../styles/ExperienceList.module.css";

const formatDate = (isoDate) => {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Date(isoDate).toLocaleDateString('fr-FR', options);
};

const ExperienceList = () => {
  const { profileId } = useParams();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p className="loading">Chargement des expériences…</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="experience-list-container">
      <h2 className="section-title">Expériences</h2>
      {experiences.length === 0 ? (
        <p className="no-data">Aucune expérience trouvée.</p>
      ) : (
        <div className="experience-grid">
          {experiences.map(e => (
            <div className="experience-card" key={e.id}>
              <h3 className="experience-title">{e.title || "Titre non renseigné"}</h3>
              <p className="experience-role">
                {(e.role || "Rôle non renseigné")} – {(e.company || "Entreprise non renseignée")} (
                {e.start_date ? formatDate(e.start_date) : "Date début inconnue"} – {e.end_date ? formatDate(e.end_date) : "Date fin inconnue"})
              </p>
              <p className="experience-description">{e.description || "Description non renseignée"}</p>
              <Link
                to={`/profiles/${profileId}/experiences/${e.id ?? ''}`}
                className="experience-link"
              >
                Voir l'expérience : {e.name || "Sans nom"}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default ExperienceList;