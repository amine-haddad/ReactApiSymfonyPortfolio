import React, { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import useSingleProfile from "../../../hooks/useSingleProfile";
import DynamicShapes from "../../../components/DynamicShapes";
import TypingEffectPersonalisable from "../../../components/TypingEffectPersonalisable";
import AnimatedSection from "../../../components/AnimatedSection";
import styles from "../../../styles/ProfilePage.module.css";

// Imports dynamiques pour code splitting (lazy loading)
const Profile = lazy(() => import("../../../components/profile/Profile"));
const ProfileProjects = lazy(() => import("../../../components/profile/ProfileProjects"));
const ProfileExperiences = lazy(() => import("../../../components/profile/ProfileExperiences"));
const ProfileSkills = lazy(() => import("../../../components/profile/ProfileSkills"));
const ProfileAbout = lazy(() => import("../../../components/profile/ProfileAbout"));

const Index = () => {
  const { profileId } = useParams();
  // Utilisation du hook unique en mode public
  const { profile, loading, error } = useSingleProfile(profileId, { forcePublic: true });

  console.log("profile privé", profile, "error", error);

  if (loading) return <p className={styles.profileLoading}>Chargement...</p>;
  if (error) return <p className={styles.profileError}>Erreur : {error}</p>;
  if (!profile) return <p className={styles.profileNotFound}>Profil non trouvé</p>;

  const fallback = <p>Chargement...</p>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <DynamicShapes />
        <div className={styles.profileOverlay}>
          <TypingEffectPersonalisable name={profile.name} title={profile.title} />
        </div>
      </div>
      <div className={styles.profileContent}>
        <h1 className={styles.profileTitle}>{profile.title}</h1>
        <h2 className={styles.profileSubtitle}>{profile.name}</h2>

        <Suspense fallback={fallback}>
          <AnimatedSection>
            <Profile profile={profile} />
          </AnimatedSection>
        </Suspense>
        <Suspense fallback={fallback}>
          <AnimatedSection>
            <ProfileProjects projects={profile.projects || []} />
          </AnimatedSection>
        </Suspense>
        <Suspense fallback={fallback}>
          <AnimatedSection>
            <ProfileExperiences experiences={profile.experiences || []} />
          </AnimatedSection>
        </Suspense>
        <Suspense fallback={fallback}>
          <AnimatedSection>
            <ProfileSkills skills={profile.profileSkills || []} />
          </AnimatedSection>
        </Suspense>
        <Suspense fallback={fallback}>
          <AnimatedSection>
            <ProfileAbout profile={profile} />
          </AnimatedSection>
        </Suspense>
      </div>
    </div>
  );
};

export default Index;
