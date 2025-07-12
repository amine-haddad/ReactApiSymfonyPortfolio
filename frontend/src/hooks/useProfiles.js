import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

function useProfiles({ mine = false } = {}) {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    if (mine) {
      if (user && Array.isArray(user.userProfiles)) {
        setProfiles(user.userProfiles);
        setLoading(false);
      } else {
        setProfiles([]);
        setLoading(false);
      }
      return;
    }

    // Sinon, requête API classique
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/profiles", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        const profilesArray = Array.isArray(data["hydra:member"])
          ? data["hydra:member"]
          : Array.isArray(data.member)
          ? data.member
          : [];

        setProfiles(profilesArray);
      } catch (err) {
        setError("Impossible de charger les profils.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [authLoading, user, mine]);

  return { profiles, loading, error };
}

export default useProfiles;
