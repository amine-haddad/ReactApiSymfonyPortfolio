import { useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import useProfiles from "../../../../hooks/useProfiles";
import Profile from "../../../../components/profile/Profile";
import ProfileProjects from "../../../../components/profile/ProfileProjects";
import ProfileExperiences from "../../../../components/profile/ProfileExperiences";
import ProfileSkills from "../../../../components/profile/ProfileSkills";
import ProfileAbout from "../../../../components/profile/ProfileAbout";
import DynamicShapes from "../../../../components/DynamicShapes";
import TypingEffect from "../../../../components/TypingEffect";
import Spinner from "../../../../components/Spinner";
import AnimatedSection from "../../../../components/AnimatedSection";
import styles from "../../../../styles/ProfilePage.module.css";

const Index = () => {
  const { profileId } = useParams();
  const { user } = useContext(AuthContext);
  const { profiles, loading, error } = useProfiles({ mine: true });

  if (loading || !user || !Array.isArray(user.userProfiles) || profiles.length === 0) {
    return (
      <div className="text-center text-xl text-blue-500/40 mt-8">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-xl text-red-500/70 mt-8">
        Erreur : {error}
      </p>
    );
  }

  const profile = profiles.find((p) => p.id === Number(profileId));
  const isOwner = user.userProfiles.some((p) => p.id === Number(profileId));

  if (!profile || !isOwner) return <Navigate to="/NotFound" replace />;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <DynamicShapes />
        <div className={styles.profileOverlay}>
          <TypingEffect />
        </div>
      </div>
      <div className={styles.profileContent}>
        <div>
          <h1 className={styles.profileTitle}>
            {profile.title}
          </h1>
          <h2 className={styles.profileSubtitle}>
            {profile.name}
          </h2>
        </div>
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
          <ProfileAbout profile={profile || []} />
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Index;
