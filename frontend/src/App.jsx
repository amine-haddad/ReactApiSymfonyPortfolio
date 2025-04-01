import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router"; // Vérifie le chemin
import "./styles/App.css"; // Import de styles globaux (si besoin)
import { AuthProvider } from "./contexts/AuthContext"; // Le contexte d'authentification
import { NavbarProvider } from "./contexts/NavbarContext"; // ✅ Import du provider

const App = () => {
  
  return (
    <AuthProvider >
    <div className="app-container">
    <NavbarProvider> {/* ✅ Le provider englobe toute l'app */}
      <RouterProvider  router={Router} />
      </NavbarProvider>
    </div>
    </AuthProvider>
  );
};

export default App;
