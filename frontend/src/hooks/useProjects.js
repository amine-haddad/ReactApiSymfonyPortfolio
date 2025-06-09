import { useEffect, useState } from "react";

const useProjects = (profileId, page = 1, limit = 10) => {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    setError(null);

    fetch(
      `/api/profiles/${profileId}/projects${limit ? `?limit=${limit}` : ""}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors du chargement des projets.");
        return res.json();
      })
      .then((data) => {
        setProjects(data.data || []);
        setTotal(data.total || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [profileId, page, limit]);

  return { projects, total, loading, error };
};

export default useProjects;
