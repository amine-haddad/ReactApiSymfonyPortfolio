import { useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout();         // Attend que le logout soit fini
      navigate("/");          // Puis redirige vers l'accueil
    };

    handleLogout();
  }, [logout, navigate]);

  return null; // Pas d'affichage, juste une action
};

export default Logout;
