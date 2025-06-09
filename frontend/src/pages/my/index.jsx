import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";
import styles from "../../styles/Dashboard.module.css"; // à créer si tu veux styliser
import PageLayout from "../../layouts/PageLayout";
import Spinner from "../../components/Spinner";

function AdminDashboard() {
  const { user, loading, error } = useContext(AuthContext);

  if (loading) return <div className={styles.dashboardCard}><Spinner /></div>;
  if (error) return <p>Erreur : {error}</p>;
  if (!user) return <p>Non connecté.</p>;

  const profiles = user.userProfiles || [];
  const totalProfiles = profiles.length;
  const totalViews = profiles.reduce((acc, profile) => acc + (profile.views || 0), 0);
  const lastUpdatedProfile = profiles.reduce((latest, current) =>
    new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest,
    profiles[0] || null
  );
  console.log('les profiles:', profiles);
  return (
    <PageLayout>
      <div className="container mt-5">
        <h2 className="mb-4">Tableau de bord</h2>

        <div className="row mb-4">
          <div className="col-md-4">
            <div className={styles.dashboardCard}>
              <h5>Profils créés</h5>
              <p>{totalProfiles}</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className={styles.dashboardCard}>
              <h5>Vues totales</h5>
              <p>{totalViews}</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className={styles.dashboardCard}>
              <h5>Dernière modification</h5>
              {lastUpdatedProfile ? (
                <>
                  <p>{lastUpdatedProfile.name}</p>
                  <small>{new Date(lastUpdatedProfile.updatedAt).toLocaleString()}</small>
                </>
              ) : (
                <p>Aucun profil</p>
              )}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <Link to="/my/profiles" className="btn btn-outline-primary me-2">Voir mes profils</Link>
          <Link to="/my/profiles/create" className="btn btn-primary">Créer un profil</Link>
        </div>
      </div>
    </PageLayout>
  );
}

export default AdminDashboard;
