import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";

import Profile from "../../../../components/profile/Profile";
import ProfileProjects from "../../../../components/profile/ProfileProjects";
import ProfileExperiences from "../../../../components/profile/ProfileExperiences";
import ProfileSkills from "../../../../components/profile/ProfileSkills";
import ProfileAbout from "../../../../components/profile/ProfileAbout";
import DynamicShapes from "../../../../components/DynamicShapes";
import TypingEffect from "../../../../components/TypingEffect";
import styles from "../../../../styles/ProfilePage.module.css";
import PageLayout from "../../../../layouts/PageLayout";

const Index = () => {
  const { profileId } = useParams();
  const {
    user,
    profiles,
    loading,
    error,
  } = useContext(AuthContext);

  const profile = profiles.find((p) => p.id === Number(profileId));

  if (loading) return <p className={styles.profileLoading}>Chargement du dashboard...</p>;
  if (error) return <p className={styles.profileError}>Erreur : {error}</p>;
  if (!user) return <p className={styles.profileNotFound}>Non connecté.</p>;
  if (!profile) return <p className={styles.profileNotFound}>Profil non trouvé</p>;

  return (
    <div className={styles.profilePage}>
      {/* Effets visuels */}
      <div className={styles.profileHeader}>
        <DynamicShapes />
        <div className={styles.profileOverlay}>
          <TypingEffect />
        </div>
      </div>

      {/* Contenu du profil */}
      <div className={styles.profileContent}>
        <Profile profile={profile} />
        <ProfileProjects projects={profile.projects || []} />
        <ProfileExperiences experiences={profile.experiences || []} />
        <ProfileSkills skills={profile.profileSkills || []} />
        <ProfileAbout profile={profile} />
      </div>
    </div>
  );
};

export default Index;
