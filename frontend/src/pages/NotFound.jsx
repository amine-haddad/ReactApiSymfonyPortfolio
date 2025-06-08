import "../styles/NotFound.css";
import DynamicShapes from "../components/DynamicShapes";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="notfound-container">
      <div className="dynamic-background">
        <DynamicShapes />
      </div>

      <div className="notfound-content">
        <h1 className="notfound-title">404</h1>
        <h2 className="notfound-subtitle">Page non trouvée</h2>
        <p className="notfound-text">Oups Didou, on dirait que tu t'es perdu.</p>
        <Link to="/" className="notfound-link">Retour à l'accueil</Link>
      </div>
    </div>

  );
}

export default NotFound;
