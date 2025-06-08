import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router"; // Vérifie le chemin
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS;
import "./styles/App.css"; // Import de styles globaux (si besoin)
import { AuthProvider } from "./contexts/AuthProvider"; // Le contexte d'authentification

const App = () => {

  return (
    <AuthProvider >
      <div className="app-container">
        {/* ✅ Le provider englobe toute l'app */}
        <RouterProvider router={Router} />

      </div>
    </AuthProvider>
  );
};

export default App;
