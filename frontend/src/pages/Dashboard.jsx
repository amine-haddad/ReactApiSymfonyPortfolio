import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { fetchData } from "../services/apiService"; 
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"; // Importer Link

const Dashboard = () => {
  const { user,isAuthenticated } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setError("Token manquant");
        return;
      }

      try {
        // Décoder le token pour récupérer l'ID utilisateur
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userId = decodedToken.id;
        console.log("ID extrait du token:", decodedToken);

        // Récupérer directement les infos de l'utilisateur via son ID
        const response = await axios.get(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data);
        setProfiles(response.data.userProfiles || []);
        console.log({datares:response.data.userProfiles});
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des données utilisateur");
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, user]);


  return (
    <div>
      <h1>Dashboard1</h1>
      {error ? (
        <div style={{ color: "red" }}>Erreur: {error}</div>
      ) : (
        <div>
          {data ? (
            <div>
              <div><strong>ID:</strong> {data.id}</div>
              <div><strong>Email:</strong> {data.email}</div>
              <div><strong>Roles:</strong> {data.roles.join(', ')}</div>

              {/* Affichage des profils associés */}
              <div>
                <h2>Profils:</h2>
                {profiles.length > 0 ? (
                  profiles.map((profile) => (
                    <div
                      key={profile.id}
                      style={{
                        marginBottom: '20px',
                        border: '1px solid #ccc',
                        padding: '10px',
                        borderRadius: '5px',
                      }}
                    >
                        <div><strong>id:</strong> {profile.id}</div>
                      <div><strong>Nom:</strong> {profile.name}</div>
                      <div><strong>Titre:</strong> {profile.title}</div>
                      <div><strong>Bio:</strong> {profile.bio}</div>
                      <div><strong>Email:</strong> {profile.email}</div>
                      <div><strong>GitHub:</strong> <a href={profile.github_url} target="_blank" rel="noopener noreferrer">GitHub</a></div>
                      <div><strong>LinkedIn:</strong> <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
                      <div><strong>Projets:</strong> {profile.projects.length > 0 ? profile.projects.join(', ') : 'Aucun projet associé'}</div>
                      <div><strong>Expériences:</strong> {profile.experiences.length > 0 ? profile.experiences.join(', ') : 'Aucune expérience associée'}</div>
                      <div><strong>Images:</strong> {profile.images.length > 0 ? profile.images.join(', ') : 'Aucune image associée'}</div>

                      {/* Remplacer le clic par un <Link> pour la redirection */}
                      <Link to={`/profile/${profile.id}`} style={{ marginTop: '10px', display: 'block' }}>
                        Voir le profil
                      </Link>
                    </div>
                  ))
                ) : (
                  <div>Aucun profil trouvé.</div>
                )}
              </div>
            </div>
          ) : (
            "Chargement..."
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
