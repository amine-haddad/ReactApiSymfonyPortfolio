import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const NavbarContext = createContext(); // ✅ Déclaration correcte (pas redéclarée ensuite)

export const NavbarProvider = ({ children }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 100);
      setIsVisible(scrollPosition > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        if (!token) return;

        const response = await axios.get("/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération de l'utilisateur", err);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    setCurrentPage(currentPath); // Met à jour la page actuelle à chaque changement
  }, [window.location.pathname]); // Cela surveille les changements de page
  return (
    <NavbarContext.Provider
      value={{
        isSticky,
        isVisible,
        currentPage,
        setCurrentPage,
        profile,
        setProfile,
        user,
        setUser,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar() doit être utilisé dans un <NavbarProvider>");
  }
  return context;
};
