import { useEffect, useState } from "react";

const useSingleExperience = (profileId, experienceId) => {
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profileId || !experienceId) return;
    setLoading(true);
    setError(null);

    fetch(`/api/profiles/${profileId}/experiences/${experienceId}`)
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors du chargement de l'expérience.");
        return res.json();
      })
      .then((data) => setExperience(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [profileId, experienceId]);

  return { experience, loading, error };
};

export default useSingleExperience;
