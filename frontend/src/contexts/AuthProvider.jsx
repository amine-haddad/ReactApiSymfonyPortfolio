import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/api/me", { withCredentials: true });
      setUser(res.data.user);
      console.log("USER RECUPERE", res.data.user);
      setError(null);
    } catch (e) {
      console.error("Fetch user failed:", e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (credentials) => {
    try {
      setError(null);
      await axios.post("/api/login_check", credentials, { withCredentials: true });
      await fetchUser();
      return true;
    } catch (e) {
      console.error("Login failed:", e);
      setUser(null);
      setError("Identifiants incorrects");
      return false;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
    } catch (e) {
      console.error("Logout failed:", e);
    } finally {
      setUser(null);
      await fetchUser();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user // Ajout ici
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
