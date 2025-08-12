import { useState, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login({ email, password });
    setLoading(false);

    if (success) {
      navigate("/admin/");
    }
  };

  return (
    <PageLayout>
      <div className="login-page d-flex align-items-center justify-content-center min-vh-100">
        <div className="login-container p-4 rounded shadow-sm w-100" style={{ maxWidth: "400px" }}>
          <h2 className="text-center mb-4">Se connecter</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Mot de passe</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-control"
              />
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}
            <button type="submit" disabled={loading} className="btn btn-primary w-100">
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          <div className="text-center mt-3">
            <p className="text-muted">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-primary">Créer un compte</Link>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;
