import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import useProfiles from "../../hooks/useProfiles";
import { Link } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import Spinner from "../../components/Spinner";
import ProtectedRoute from "../../components/ProtectedRoute";
import Button from "../../components/ui/Button";
import styles from '../../styles/Dashboard.module.css'

function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const { profiles, loading, error } = useProfiles({ mine: true });

  if (loading)
    return (
      <div className="container my-5">
        <div className="text-center p-4 bg-light rounded shadow">
          <Spinner />
        </div>
      </div>
    );

  if (error) return <p className="text-danger text-center">Erreur : {error}</p>;
  if (!user) return <p className="text-muted text-center">Non connecté.</p>;

  const totalProfiles = profiles.length;
  const totalViews = profiles.reduce((acc, profile) => acc + (profile.views || 0), 0);
  const lastUpdatedProfile = profiles.reduce((latest, current) => {
    const latestDate = latest && latest.updated_at ? new Date(latest.updated_at) : null;
    const currentDate = current.updated_at ? new Date(current.updated_at) : null;

    if (!latestDate) return current;
    if (!currentDate) return latest;

    return currentDate > latestDate ? current : latest;
  }, profiles[0] || null);

  // Affichage des infos du user
  return (
    <PageLayout>
      <div className="container py-5">
        <h1 className="text-center text-uppercase mb-5 dashboardTitle">Tableau de bord</h1>
        <div className="mb-4 text-center">
          <h2>Bienvenue {user.first_name} {user.last_name}</h2>
          <p>Email : {user.email}</p>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-12 col-md-4">
            <div className={styles.dashboardCard}>
              <h4>Profils créés</h4>
              <p>{totalProfiles}</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className={styles.dashboardCard}>
              <h4>Vues totales</h4>
              <p>{totalViews}</p>
            </div>
          </div>
          <div className="col-12 col-md-4">
            <div className={styles.dashboardCard}>
              <h4>Dernière modification</h4>
              {lastUpdatedProfile ? (
                <>
                  <p>{lastUpdatedProfile.name}</p>
                  <small className="text-muted">{formatDate(lastUpdatedProfile.updated_at)}</small>
                </>
              ) : (
                <p>Aucun profil</p>
              )}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between gap-4 flex-wrap">
          <Button className="btn" to="/my/profiles">
            Voir mes profils
          </Button>
          <Button className="btn" to="/my/profiles/create">
            Créer un profil
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}

export default function () {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "Non renseignée";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
