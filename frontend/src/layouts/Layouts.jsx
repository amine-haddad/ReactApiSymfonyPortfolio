import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import CustomNavbar from "../components/navbar/CustomNavBar";
import Footer from "../components/footer/Footer";
import { useNavbar } from "../contexts/NavbarContext"; // ✅ Vérifie cet import

function Layout() {
  const navbarContext = useNavbar(); // ✅ Vérifie qu'il ne retourne pas undefined

  // Ajoute un log pour voir si `useNavbar()` fonctionne
  console.log("🚀 navbarContext:", navbarContext);

  if (!navbarContext) {
    throw new Error("❌ useNavbar() a retourné undefined ! Vérifie que NavbarProvider est bien défini.");
  }

  const { setCurrentPage } = navbarContext;
  const location = useLocation();

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname, setCurrentPage]);

  return (
    <>
      {/*<CustomNavbar />*/}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
