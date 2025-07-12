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
    <div className="flex flex-col min-h-screen">
      <CustomNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
