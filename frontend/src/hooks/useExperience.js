import { useState, useEffect } from "react";

function useExperience(profileId, page = 1, limit = 10) {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);
    fetch(`/api/profiles/${profileId}/experiences?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setExperiences(data.data || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les expériences.");
        setLoading(false);
      });
  }, [profileId, page, limit]);

  return { experiences, loading, error, total };
}

export default useExperience;