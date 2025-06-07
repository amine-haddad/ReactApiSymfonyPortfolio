import { Outlet } from "react-router-dom";
import CustomNavbar from "../components/navbar/CustomNavBar.jsx";
import Footer from "../components/footer/Footer.jsx";

function Layout() {
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
