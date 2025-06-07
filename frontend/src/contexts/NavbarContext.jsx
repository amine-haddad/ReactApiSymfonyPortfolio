import { AuthContext } from "./AuthContext"; // Import du hook du AuthContext
import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const { user: authUser, profile: authProfile } = AuthContext(); // Récupère l'utilisateur et le profil depuis AuthContext

  useEffect(() => {
    setUser(authUser);
    setProfile(authProfile);
  }, [authUser, authProfile]);

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
    setCurrentPage(location.pathname);
  }, [location.pathname]);

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
