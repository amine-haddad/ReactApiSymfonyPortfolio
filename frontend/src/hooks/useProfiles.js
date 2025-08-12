import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

function useProfiles({ mine = false } = {}) {
  const { user, loading: authLoading, isAuthenticated } = useContext(AuthContext);
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

    // Choix de l'endpoint selon l'authentification
    const endpoint = isAuthenticated ? "/api/profiles" : "/api/public/profiles";

    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(endpoint, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
        // Pour API Platform ou ta structure custom
        const profilesArray = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data["hydra:member"])
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
  }, [authLoading, user, mine, isAuthenticated]);

  return { profiles, loading, error };
}

export default useProfiles;
