import { useState, useEffect, useContext } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../styles/CustomNavBar.css";
import { FaBars } from "react-icons/fa";
import DynamicLine from "./DynamicLine";
import { AuthContext } from "../../contexts/AuthContext";

const CustomNavbar = ({ profile, error }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [user, setUser] = useState(profile || {}); // Initialiser avec `profile`
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");

  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile]); // Met à jour `user` quand `profile` change

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
      setIsVisible(window.scrollY <= lastScrollY);
      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleLogout = () => {
    console.log("Déconnexion...");
    navigate("/login");
  };

  return (
    <Navbar
      expand="lg"
      className={`navbar navbar-light bg-light ${
        isHomePage ? "navbar-home" : "navbar-top"
      } ${isSticky ? "sticky" : ""} ${isVisible ? "visible" : ""}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src="/assets/cannon_old_weapon.svg" alt="Logo" className="navbar-logo" />
        </Navbar.Brand>

        <div className="navbar-center">
          {error && <span className="error">{error}</span>}
          {user.name ? (
            <span className="navbar-name">
              {user.name} <span className="navbar-title">{user.roles}</span>
            </span>
          ) : (
            <span>Loading...</span>
          )}
        </div>

        <Navbar.Toggle aria-controls="navbarNav">
          <FaBars size={25} color="#333" />
        </Navbar.Toggle>

        <Navbar.Collapse id="navbarNav">
          <Nav className="ms-auto">
            <Nav.Item>
              <Nav.Link as={Link} to="/" className="nav-link">
                Accueil
                <DynamicLine />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/projects" className="nav-link">
                Projects
                <DynamicLine />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/experiences" className="nav-link">
                Expériences
                <DynamicLine />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/about" className="nav-link">
                À propos
                <DynamicLine />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link id="themeButton" className="themeButton" onClick={toggleTheme}>
                {darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </Nav.Link>
            </Nav.Item>

            {/* Gestion dynamique de l'authentification */}
            {isAuthenticated ? (
              <>
                <Nav.Item>
                  <Nav.Link as={Link} to={`/profile/${user.id}`} className="nav-link">
                    Mon Profil
                    <DynamicLine />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link className="logout-button" onClick={handleLogout}>
                    Déconnexion
                    <DynamicLine />
                  </Nav.Link>
                </Nav.Item>
              </>
            ) : (
              <Nav.Item>
                <Nav.Link as={Link} to="/login" className="login-button">
                  Login
                  <DynamicLine />
                </Nav.Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
