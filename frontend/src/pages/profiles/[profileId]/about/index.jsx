import { useParams } from "react-router-dom";
import useSingleProfile from "../../../../hooks/useSingleProfile";
import PageLayout from "../../../../layouts/PageLayout";
import styles from "../../../../styles/ProfileAbout.module.css";
import Spinner from "../../../../components/Spinner";

const ProfileAbout = () => {
  const { profileId } = useParams();
  const { profile, loading, error } = useSingleProfile(profileId, { forcePublic: true });

  if (loading) return <div className={styles.container}><Spinner /></div>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!profile) return <p className={styles.notFound}>Profil introuvable.</p>;

  return (
    <PageLayout>
      <div className={styles.container}>
        <h1 className={styles.title}>À propos</h1>
        <div className={styles.aboutSection}>
          <p><strong>Nom :</strong> {profile.first_name} {profile.last_name}</p>
          <p><strong>Email :</strong> {profile.email || "Non renseigné"}</p>
          <p><strong>Bio :</strong> {profile.bio || "Aucune bio renseignée."}</p>
          <p><strong>Localisation :</strong> {profile.location || "Non renseignée"}</p>
          {/* Ajoute ici d'autres champs si besoin */}
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfileAbout;