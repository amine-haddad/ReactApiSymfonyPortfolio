import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

function useProfiles() {
  const { loading: authLoading, isAuthenticated } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

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
        console.log("Réponse API profiles:", data);
        if (Array.isArray(data)) {
          setProfiles(data);
        } else if (data && Array.isArray(data.data)) {
          setProfiles(data.data);
        } else {
          setProfiles([]);
        }
      } catch (err) {
        setError("Impossible de charger les profils.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [authLoading, isAuthenticated]);

  return { profiles, loading, error };
}

export default useProfiles;
