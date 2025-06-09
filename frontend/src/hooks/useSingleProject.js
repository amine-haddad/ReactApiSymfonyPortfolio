import { useEffect, useState } from "react";

const useSingleProject = (profileId, projectId) => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profileId || !projectId) return;
    setLoading(true);
    setError(null);

    fetch(`/api/profiles/${profileId}/projects/${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement du projet.");
        return res.json();
      })
      .then((data) => setProject(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [profileId, projectId]);

  return { project, loading, error };
};

export default useSingleProject;
