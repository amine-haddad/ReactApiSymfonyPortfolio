import { useParams } from "react-router-dom";
import useProfiles from "../../../hooks/useProfiles";
import Profile from "../../../components/profile/Profile";
import ProfileProjects from "../../../components/profile/ProfileProjects";
import ProfileExperiences from "../../../components/profile/ProfileExperiences";
import ProfileSkills from "../../../components/profile/ProfileSkills";
import ProfileAbout from "../../../components/profile/ProfileAbout";
import DynamicShapes from "../../../components/DynamicShapes";
import TypingEffect from "../../../components/TypingEffect";
import AnimatedSection from "../../../components/AnimatedSection";
import styles from "../../../styles/ProfilePage.module.css";

const Index = () => {
  const { profileId } = useParams();
  const { profiles, loading, error } = useProfiles();
  const profile = profiles?.find((p) => String(p.id) === String(profileId));

  if (loading) return <p className={styles.profileLoading}>Chargement...</p>;
  if (error) return <p className={styles.profileError}>Erreur : {error}</p>;
  if (!profile) return <p className={styles.profileNotFound}>Profil non trouvé</p>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <DynamicShapes />
        <div className={styles.profileOverlay}>
          <TypingEffect />
        </div>
      </div>
      <div className={styles.profileContent}>
        <h1 className="mt-5 underline uppercase text-center font-title font-bold">
          Profil de {profile.name} – {profile.title} sur PortfolioHub
        </h1>
        <AnimatedSection>
          <Profile profile={profile} />
        </AnimatedSection>
        <AnimatedSection>
          <ProfileProjects projects={profile.projects || []} />
        </AnimatedSection>
        <AnimatedSection>
          <ProfileExperiences experiences={profile.experiences || []} />
        </AnimatedSection>
        <AnimatedSection>
          <ProfileSkills skills={profile.profileSkills || []} />
        </AnimatedSection>
        <AnimatedSection>
          <ProfileAbout profile={profile} />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Index;
