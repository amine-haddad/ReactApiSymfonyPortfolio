import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/login_check",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.token;
      if (!token) {
        throw new Error("Token manquant dans la réponse du serveur.");
      }

      await login(token); // ✅ appel simplifié
      navigate("/my");
    } catch (err) {
      console.error("Erreur lors de la connexion :", err.response || err.message);
      setError(
        err.response?.status === 401
          ? "Identifiants incorrects. Veuillez réessayer."
          : err.response?.data?.message || "Erreur de connexion. Réessayez plus tard."
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="login-page d-flex align-items-center justify-content-center bg-light min-vh-100">
      <div className="login-container bg-white p-4 rounded shadow-sm w-100" style={{ maxWidth: "400px" }}>
        <h2 className="login-title text-center mb-4">Se connecter</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-field mb-3">
            <label htmlFor="email" className="login-label form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="login-input form-control"
            />
          </div>
          <div className="login-field mb-4">
            <label htmlFor="password" className="login-label form-label">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input form-control"
            />
          </div>
          {error && <div className="login-error text-danger mb-3">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="login-button btn btn-primary w-100"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <div className="login-footer text-center mt-3">
          <p className="text-muted">
            Pas encore de compte ?{" "}
            <Link to="/register" className="login-link text-primary">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
