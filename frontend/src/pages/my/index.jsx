import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import useProfiles from "../../hooks/useProfiles";
import { Link } from "react-router-dom";
import PageLayout from "../../layouts/PageLayout";
import Spinner from "../../components/Spinner";
import ProtectedRoute from "../../components/ProtectedRoute";
import Button from "../../components/ui/Button";
import styles from '../../styles/Dashboard.module.css'
import style from "../../styles/ProfilesList.module.css";

function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { profiles, loading: profilesLoading, error } = useProfiles();
  const [globalFilter, setGlobalFilter] = useState("");

  if (authLoading || profilesLoading) return <Spinner />;
  if (error) return <p className="text-danger text-center">Erreur : {error}</p>;
  if (!user) return <p className="text-muted text-center">Non connecté.</p>;

  const filter = globalFilter.toLowerCase();

  const profilesToShow = isAuthenticated
    ? profiles.filter(p => p.user === user.id) // privé
    : profiles; // public

  const filteredProfiles = profilesToShow.filter((p) => {
    const nameMatch = p.name?.toLowerCase().includes(filter);
    const titleMatch = p.title?.toLowerCase().includes(filter);
    const skillMatch = p.profileSkills?.some((skill) =>
      skill.skill?.name?.toLowerCase().includes(filter)
    );
    return nameMatch || titleMatch || skillMatch;
  });

  const totalProfiles = filteredProfiles.length;
  const totalViews = filteredProfiles.reduce((acc, profile) => acc + (profile.views || 0), 0);
  const lastUpdatedProfile = filteredProfiles.reduce((latest, current) => {
    const latestDate = latest && latest.updated_at ? new Date(latest.updated_at) : null;
    const currentDate = current.updated_at ? new Date(current.updated_at) : null;

    if (!latestDate) return current;
    if (!currentDate) return latest;

    return currentDate > latestDate ? current : latest;
  }, filteredProfiles[0] || null);

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

        <input
          type="text"
          className="form-control mb-4"
          placeholder="Rechercher par nom, titre ou compétence..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
        />

        {filteredProfiles.length > 0 && (
          <section className={`${style.sectionListProfiles} d-flex gap-4`}>
            <div className={`${style.profilesListContainer} flex-grow-1`}>
              <h2 className="display-6 fw-bold text-uppercase mb-4 text-center titlePortfoliohub">
                Vos profils privés
              </h2>
              <div className="row g-4">
                {filteredProfiles.map((profile) => {
                  const sortedSkills = [...(profile.profileSkills || [])].sort((a, b) => b.level - a.level);
                  return (
                    <div className="col-12 col-md-6 col-lg-4" key={profile.id}>
                      <div className={style.profileCardList}>
                        <h5 className={`${style.profileName} fw-bold mb-1`}>
                          {profile.name}
                        </h5>
                        <h6 className={`${style.profileTitle} mb-2 fst-italic`}>
                          {profile.title}
                        </h6>
                        <p>{profile.bio}</p>
                        {sortedSkills.length > 0 && (
                          <div className="mb-2 d-flex flex-wrap gap-1">
                            {sortedSkills.map((skillObj, j) => (
                              <span
                                key={j}
                                className="badge rounded-pill"
                                style={{
                                  background: "var(--accent-color)",
                                  color: "#fff",
                                  fontWeight: 500,
                                  fontSize: "0.95em",
                                }}
                                title={`Niveau : ${skillObj.level}`}
                              >
                                {skillObj.skill?.name}
                                {skillObj.level ? <span style={{ opacity: 0.7 }}> ({skillObj.level}%)</span> : ""}
                              </span>
                            ))}
                          </div>
                        )}
                        <Button to={`/my/profiles/${profile.id}`} className="mt-3">
                          Voir le profil
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
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
