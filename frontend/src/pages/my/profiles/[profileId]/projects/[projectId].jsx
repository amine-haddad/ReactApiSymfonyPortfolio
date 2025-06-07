// src/pages/profiles/[profileId]/projects/[projectId].jsx
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ProjectDetail = () => {
  const { profileId, projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/profiles/${profileId}/projects/${projectId}`)
      .then(res => res.json())
      .then(data => {
        setProject(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur de chargement du projet :", err);
        setLoading(false);
      });
  }, [profileId, projectId]);

  if (loading) return <p>Chargement du projet...</p>;
  if (!project) return <p>Projet introuvable.</p>;

  return (
    <div>
      <h2>{project.title}</h2>
      <p><strong>Description :</strong> {project.description}</p>
      <p><strong>Date :</strong> {project.date}</p>
      <p><strong>Technologies :</strong> {project.technologies?.map(t => t.name).join(", ")}</p>

      <Link to={`/profiles/${profileId}/projects`}>← Retour aux projets</Link>
    </div>
  );
};

export default ProjectDetail;
