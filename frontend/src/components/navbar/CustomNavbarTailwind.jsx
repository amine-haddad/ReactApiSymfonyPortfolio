import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import DynamicLine from "./DynamicLine";
import { AuthContext } from "../../contexts/AuthContext";
import DarkModeToggle from "../ui/DarkModeToggle";

const CustomNavbarTailwind = () => {
  const { isAuthenticated, user, profiles, loading, error } = useContext(AuthContext);
  const location = useLocation();

  // Regex profil
  const profileMatch = location.pathname.match(/^\/(my\/)?profiles\/(\d+)(\/.*)?$/);
  const isProfilePage = !!profileMatch;
  const isPrivateProfilePage = profileMatch?.[1] === "my/";
  const profileId = profileMatch ? Number(profileMatch[2]) : null;
  const isExactProfilePage = location.pathname.match(/^\/(my\/)?profiles\/\d+$/);
  const currentProfile = profileId != null ? profiles.find((p) => p.id === profileId) : null;
  const displayName = isProfilePage
    ? currentProfile?.name || "Profil Inconnu"
    : user?.last_name || "Utilisateur";

  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [isSticky, setIsSticky] = useState(false);
  const [isVisible, setIsVisible] = useState(!isExactProfilePage);
  const [menuOpen, setMenuOpen] = useState(false);

  const lastScrollY = useRef(window.scrollY);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const isScrollingUp = scrollY <= lastScrollY.current;

      let newSticky = false;
      let newVisible = false;

      if (isExactProfilePage) {
        newSticky = scrollY > 200;
        newVisible = scrollY > 200 && isScrollingUp;
      } else {
        newSticky = scrollY > 50;
        newVisible = isScrollingUp;
      }

      if (newSticky !== isSticky) setIsSticky(newSticky);
      if (newVisible !== isVisible) setIsVisible(newVisible);

      lastScrollY.current = scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isExactProfilePage, isSticky, isVisible]);

  if (loading || (isAuthenticated && !user)) return null;
  if (isExactProfilePage && !isVisible) return null;

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-white dark:bg-gray-900
        border-2 border-gray-300 dark:border-gray-700
        shadow-md
        transition-all duration-300 ease-in-out
        ${isSticky ? "opacity-100 translate-y-0" : "opacity-90"}
        ${isVisible ? "animate-fadeInDown" : "opacity-0 -translate-y-2 pointer-events-none"}
      `}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div
            className="
              w-12 h-12 sm:w-14 sm:h-14
              bg-white dark:bg-gray-800
              rounded-full border border-black dark:border-gray-600
              shadow-lg
              bg-[url('/assets/cannon_old_weapon.svg')]
              bg-contain bg-no-repeat bg-center
            "
          />
        </Link>

        {/* Centre titre */}
        <div className="flex-1 text-center select-none">
          {isAuthenticated && error && (
            <span className="text-red-500 font-semibold">{error}</span>
          )}
          <span className="uppercase font-semibold text-lg sm:text-xl font-serif italic dark:text-gray-100">
            {isAuthenticated ? displayName : "PortfolioHub"}
          </span>
        </div>

        {/* Bouton menu burger mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden relative z-50 text-gray-700 dark:text-gray-300"
          aria-label="Toggle menu"
        >
          <FaBars size={25} />
        </button>

        {/* Menu */}
        <div
          className={`
            fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700
            lg:static lg:flex lg:items-center lg:border-none
            transition-all duration-300 ease-in-out
            ${menuOpen ? "block" : "hidden"} lg:block
          `}
        >
          <ul className="flex flex-col lg:flex-row lg:space-x-8 text-center">
            <li>
              <Link
                to="/"
                className="block px-5 py-3 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium uppercase relative"
                onClick={() => setMenuOpen(false)}
              >
                Accueil
                <DynamicLine />
              </Link>
            </li>

            {isProfilePage && (
              <>
                <li>
                  <Link
                    to={`/${isPrivateProfilePage ? "my/" : ""}profiles/${profileId}/projects`}
                    className="block px-5 py-3 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium uppercase relative"
                    onClick={() => setMenuOpen(false)}
                  >
                    Projects
                    <DynamicLine />
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${isPrivateProfilePage ? "my/" : ""}profiles/${profileId}/experiences`}
                    className="block px-5 py-3 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium uppercase relative"
                    onClick={() => setMenuOpen(false)}
                  >
                    Expériences
                    <DynamicLine />
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link
                to={isAuthenticated ? "/my/profiles" : "/profiles/"}
                className="block px-5 py-3 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium uppercase relative"
                onClick={() => setMenuOpen(false)}
              >
                Profils
                <DynamicLine />
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="block px-5 py-3 text-gray-800 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 font-medium uppercase relative"
                onClick={() => setMenuOpen(false)}
              >
                À propos
                <DynamicLine />
              </Link>
            </li>

            {isAuthenticated ? (
              <li>
                <Link
                  to="/logout"
                  className="block px-5 py-3 text-gray-800 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 font-medium uppercase relative"
                  onClick={() => setMenuOpen(false)}
                >
                  Déconnexion
                  <DynamicLine />
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="block px-5 py-3 text-gray-800 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400 font-medium uppercase relative"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                  <DynamicLine />
                </Link>
              </li>
            )}

            <li>
              <DarkModeToggle />
            </li>
          </ul>
        </div>
      </div>

      {/* Animation keyframes via tailwind.config.js ou dans css global */}
      <style jsx>{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default CustomNavbarTailwind;
