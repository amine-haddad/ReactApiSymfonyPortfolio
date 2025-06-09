import { useEffect, useState } from "react";

const useExperience = (profileId, page = 1, limit = 5) => {
  const [experiences, setExperiences] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    setError(null);

    fetch(`/api/profiles/${profileId}/experiences?page=${page}&limit=${limit}`)
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors du chargement des expériences.");
        return res.json();
      })
      .then((data) => {
        setExperiences(data.data || []);
        setTotal(data.total || 0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [profileId, page, limit]);

  return { experiences, total, loading, error };
};

export default useExperience;
