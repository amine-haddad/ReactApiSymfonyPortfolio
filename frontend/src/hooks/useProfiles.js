import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

function useProfiles() {
  const { loading: authLoading, isAuthenticated, logout } = useContext(AuthContext);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;

    const endpoint = isAuthenticated ? "/api/profiles" : "/api/public/profiles";
    const fetchOptions = endpoint === "/api/profiles"
      ? { credentials: "include" }
      : {}; // Pas de credentials pour le public

    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);

        let response = await fetch(endpoint, fetchOptions);

        // Si token expiré, tente le mode public
        if (!response.ok && isAuthenticated && (response.status === 401 || response.status === 403)) {
          // Token expiré, force le logout
          if (logout) logout();
          // Puis tente le mode public
          response = await fetch("/api/public/profiles");
        }

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status}`);
        }

        const data = await response.json();
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
