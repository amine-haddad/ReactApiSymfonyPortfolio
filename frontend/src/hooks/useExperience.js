import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function useExperience(profileId, page = 1, limit = 10) {
  const { isAuthenticated } = useContext(AuthContext);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!profileId) return;
    setLoading(true);

    const endpoint = isAuthenticated
      ? `/api/profiles/${profileId}/experiences?page=${page}&limit=${limit}`
      : `/api/public/profiles/${profileId}/experiences?page=${page}&limit=${limit}`;
    const fetchOptions = isAuthenticated ? { credentials: "include" } : {};

    fetch(endpoint, fetchOptions)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        setExperiences(data.data || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger les expériences.");
        setLoading(false);
      });
  }, [profileId, page, limit, isAuthenticated]);

  return { experiences, loading, error, total };
}

export default useExperience;