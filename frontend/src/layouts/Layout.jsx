import { Outlet } from "react-router-dom";
import { useContext } from "react";
import CustomNavbar from "../components/navbar/CustomNavBar.jsx";
import Footer from "../components/footer/Footer.jsx";
import { AuthContext } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";

function Layout() {
  const { loading } = useContext(AuthContext);
  if (loading) return <Spinner />;

  return (
    <>
      <CustomNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
