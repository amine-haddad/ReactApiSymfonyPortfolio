import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);

  // Si l'on est encore en train de charger, on affiche un message de chargement.
  if (loading) return <p>Chargement...</p>;

  // Si l'utilisateur est authentifié, on retourne l'enfant (Dashboard dans ce cas)
  if (isAuthenticated) {
    return children;
  }

  // Si l'utilisateur n'est pas authentifié, on redirige vers la page de login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
