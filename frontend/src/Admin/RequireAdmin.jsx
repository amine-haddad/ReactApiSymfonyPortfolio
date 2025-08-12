import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const { user, loading } = useContext(AuthContext);

  console.log("user in RequireAdmin", user);

  if (loading) return <div>Chargement…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.roles || !user.roles.includes("ROLE_ADMIN")) {
    return <div>Accès refusé : vous n'êtes pas admin</div>; // Pour différencier login/non-admin
  }
  return children;
}