import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Hook pour charger un profil (privé ou public selon le contexte)
 * @param {string|number} profileId
 * @param {object} options - { forcePublic: boolean }
 */
function useSingleProfile(profileId, options = {}) {
  const auth = useContext(AuthContext);
  const isAuthenticated = auth?.isAuthenticated;
  const authLoading = auth?.loading;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profileId) return;
    if (!options.forcePublic && authLoading) return;

    let endpoint;
    let fetchOptions = {};
    if (options.forcePublic || isAuthenticated === undefined) {
      endpoint = `/api/public/profiles/${profileId}`;
      fetchOptions = {}; // Pas de credentials
    } else {
      endpoint = isAuthenticated
        ? `/api/profiles/${profileId}`
        : `/api/public/profiles/${profileId}`;
      fetchOptions = isAuthenticated ? { credentials: "include" } : {};
    }

    setLoading(true);
    setError(null);

    fetch(endpoint, fetchOptions)
      .then(async (res) => {
        if (!res.ok && endpoint.startsWith("/api/profiles") && (res.status === 401 || res.status === 403)) {
          // Token expiré, tente le mode public
          const publicRes = await fetch(`/api/public/profiles/${profileId}`);
          if (!publicRes.ok) throw new Error("Erreur HTTP " + publicRes.status);
          return publicRes.json();
        }
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Impossible de charger le profil.");
        setLoading(false);
      });
  }, [profileId, isAuthenticated, authLoading, options.forcePublic]);

  return { profile, loading, error };
}

export default useSingleProfile;