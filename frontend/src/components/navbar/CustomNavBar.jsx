import { useState, useEffect, useContext, useRef } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import styles from "../../styles/CustomNavBar.module.css";
import { FaBars } from "react-icons/fa";
import DynamicLine from "./DynamicLine";
import { AuthContext } from "../../contexts/AuthContext";

const CustomNavbar = () => {
  const { isAuthenticated, user, loading, error } = useContext(AuthContext);
  const profiles = user?.userProfiles || [];
  const location = useLocation();

  // Une seule regex pour profil public ou privé
  const profileMatch = location.pathname.match(/^\/(my\/)?profiles\/(\d+)(\/.*)?$/);
  const isProfilePage = !!profileMatch;
  const isPrivateProfilePage = profileMatch?.[1] === "my/";
  const profileId = profileMatch ? Number(profileMatch[2]) : null;

  // Route exacte profile (sans sous-chemin)
  const isExactProfilePage = location.pathname.match(/^\/(my\/)?profiles\/\d+$/);

  // Profil courant trouvé dans les profils
  const currentProfile = profileId != null ? profiles.find((p) => p.id === profileId) : null;

  const displayName = isProfilePage
    ? currentProfile?.name || "Profil Inconnu"
    : user?.last_name || "Utilisateur";

  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(!isExactProfilePage);

  // Ref pour stocker la dernière valeur afin d'éviter les mises à jour inutiles
  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isScrollingUp = scrollY <= lastScrollY.current;

      let newSticky, newVisible;

      if (isExactProfilePage) {
        newSticky = scrollY > 200;
        newVisible = scrollY > 200 && isScrollingUp;
      } else {
        newSticky = scrollY > 50;
        newVisible = isScrollingUp;
      }

      // Mise à jour uniquement si changement
      if (newSticky !== isSticky) setIsSticky(newSticky);
      if (newVisible !== isVisible) setIsVisible(newVisible);

      lastScrollY.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    // Initialiser l'état au chargement
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExactProfilePage, isSticky, isVisible]);

  if (loading || (isAuthenticated && !user)) return null;

  // Affiche la navbar minimaliste pendant le loading, sauf sur la page profil exacte et invisible
  if (loading && !(isExactProfilePage && !isVisible)) {
    return (
      <Navbar className={styles.navbar}>
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img src="/assets/cannon_old_weapon.svg" alt="Logo" className={styles["navbar-logo"]} />
          </Navbar.Brand>
        </Container>
      </Navbar>
    );
  }

  // Masque la navbar sur la page profil exacte et invisible (avant scroll)
  if (isExactProfilePage && !isVisible) return null;

  return (
    <Navbar
      expand="lg"
      className={`${styles.navbar} 
      ${isSticky ? styles.sticky : ""} 
      ${isVisible ? styles.visible : ""} 
      ${isProfilePage ? styles["navbar-delay"] : ""}
    `}
    >
      <Container className={styles["navbar-container"]}>
        <Navbar.Brand as={Link} to="/">
          <img
            src="/assets/cannon_old_weapon.svg"
            alt="Logo"
            className={styles["navbar-logo"]}
          />
        </Navbar.Brand>

        <div className={styles["navbar-center"]}>
          {isAuthenticated && error && <span className="error">{error}</span>}
          <span className={styles["navbar-name"]}>
            {isAuthenticated ? displayName : "PortfolioHub"}
          </span>
        </div>

        <Navbar.Toggle aria-controls="navbarNav" className={styles["navbar-toggler"]}>
          <FaBars size={25} color="#333" className={styles["navbar-toggler-icon"]} />
        </Navbar.Toggle>

        <Navbar.Collapse id="navbarNav" className={styles["navbar-nav"]}>
          <Nav className="ms-auto">
            <Nav.Item>
              <Nav.Link as={Link} to="/" className={styles["nav-link"]}>
                Accueil
                <DynamicLine />
              </Nav.Link>
            </Nav.Item>

            {isProfilePage && (
              <>
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to={`/${isPrivateProfilePage ? "my/" : ""}profiles/${profileId}/projects`}
                    className={styles["nav-link"]}
                  >
                    Projects
                    <DynamicLine />
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to={`/${isPrivateProfilePage ? "my/" : ""}profiles/${profileId}/experiences`}
                    className={styles["nav-link"]}
                  >
                    Expériences
                    <DynamicLine />
                  </Nav.Link>
                </Nav.Item>
              </>
            )}

            <Nav.Item>
              <Nav.Link
                as={Link}
                to={isAuthenticated ? "/my/profiles" : "/profiles/"}
                className={styles["nav-link"]}
              >
                Profils
                <DynamicLine />
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/about" className={styles["nav-link"]}>
                À propos
                <DynamicLine />
              </Nav.Link>
            </Nav.Item>

            {isAuthenticated ? (
              <Nav.Item>
                <Nav.Link as={Link} to="/logout" className={styles["nav-link"]}>
                  Déconnexion
                  <DynamicLine />
                </Nav.Link>
              </Nav.Item>
            ) : (
              <Nav.Item>
                <Nav.Link as={Link} to="/login" className={styles["nav-link"]}>
                  Login
                  <DynamicLine />
                </Nav.Link>
              </Nav.Item>
            )}

            <Nav.Item>
              <Nav.Link id="themeButton" onClick={() => setDarkMode((d) => !d)} className={styles["nav-link"]}>
                {darkMode ? "🌙 Dark" : "☀️ Light"}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container >
    </Navbar >
  );

};

export default CustomNavbar;
