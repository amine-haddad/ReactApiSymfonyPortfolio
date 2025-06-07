import { useContext } from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Import de PropTypes
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Si l'on est encore en train de charger, on affiche un message de chargement.
  if (loading) return <p>Chargement...</p>;

  // Si l'utilisateur est authentifié, on retourne l'enfant (Dashboard dans ce cas)
  if (user) {
    return children;
  }

  // Si l'utilisateur n'est pas authentifié, on redirige vers la page de login
  return <Navigate to="/login" replace />;
};

// Définir le type attendu pour 'children'
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // 'children' doit être un nœud React valide
};

export default ProtectedRoute;
