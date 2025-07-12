import { RouterProvider } from "react-router-dom";
import Router from "./routes/Router"; // Vérifie le chemin
import "./styles/App.css"; // Import de styles globaux (si besoin)
import { AuthProvider } from "./contexts/AuthProvider"; // Le contexte d'authentification

const App = () => {

  return (
    <AuthProvider >
      <div className="appContainer text-lg">
        {/* ✅ Le provider englobe toute l'app */}
        <RouterProvider router={Router} />

      </div>
    </AuthProvider>
  );
};

export default App;
