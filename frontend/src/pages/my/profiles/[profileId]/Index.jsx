import { useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
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
import Spinner from "../../../../components/Spinner";

const Index = () => {
  const { profileId } = useParams();
  const {
    user,
    profiles,
    loading,
    error,
  } = useContext(AuthContext);

  if (loading || !Array.isArray(user?.userProfiles) || profiles.length === 0) {
    return <p className={styles.profileLoading}><Spinner /></p>;
  }
  if (error) return <p className={styles.profileError}>Erreur : {error}</p>;
  if (!user) return <p className={styles.profileNotFound}>Non connecté.</p>;

  const profile = profiles.find((p) => p.id === Number(profileId));
  const isOwner = user.userProfiles.some(p => p.id === Number(profileId));

  if (!profile || !isOwner) return <Navigate to="/NotFound" replace />;

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
