import { useCallback, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";
import { fetchUser } from "../services/authService";
import { fetchProfiles, fetchPublicProfiles } from "../services/profileService";

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState(() => {
    const storedId = localStorage.getItem("selectedProfileId");
    return storedId && !isNaN(Number(storedId)) ? Number(storedId) : null;
  });
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les données user + profils
  const loadUserData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const userData = await fetchUser();
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      const profilesData = await fetchProfiles();
      setProfiles(profilesData);
      setIsAuthenticated(true);
    } catch (e) {
      setIsAuthenticated(false);
      setUser(null);
      setProfiles([]);
      setError("Impossible de récupérer les données.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPublicProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const publicData = await fetchPublicProfiles();
      setPublicProfiles(publicData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      loadUserData();
    } else {
      loadPublicProfiles();
    }
  }, [loadUserData, loadPublicProfiles]);

  useEffect(() => {
    if (profiles.length === 0) {
      setSelectedProfile(null);
      return;
    }

    let prof = profiles.find((p) => p.id === selectedProfileId);
    if (!prof) {
      prof = profiles[0];
      setSelectedProfileId(prof.id);
      localStorage.setItem("selectedProfileId", prof.id);
    }
    setSelectedProfile(prof);
  }, [profiles, selectedProfileId]);

  const login = async (token) => {
    localStorage.setItem("jwt_token", token);
    await loadUserData();
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setProfiles([]);
    setSelectedProfileId(null);
    setSelectedProfile(null);
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    localStorage.removeItem("selectedProfileId");

    // Recharge les profils publics en arrière-plan
    loadPublicProfiles();

    // Facultatif : redirection immédiate
    window.location.href = "/"; // ou navigate("/") si tu utilises React Router
  };

  const selectProfile = (id) => {
    if (!profiles.find((p) => p.id === id)) return;
    setSelectedProfileId(id);
    localStorage.setItem("selectedProfileId", id);
  };

  const displayName = selectedProfile
    ? selectedProfile.name
    : user?.last_name || "Utilisateur";

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        profiles,
        publicProfiles,
        selectedProfile,
        selectProfile,
        login,
        logout,
        loading,
        error,
        displayName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

