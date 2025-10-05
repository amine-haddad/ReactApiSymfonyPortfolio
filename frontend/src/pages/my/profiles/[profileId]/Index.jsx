import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../../../contexts/AuthContext";
import Profile from "../../../../components/profile/Profile";
import ProfileProjects from "../../../../components/profile/ProfileProjects";
import ProfileExperiences from "../../../../components/profile/ProfileExperiences";
import ProfileSkills from "../../../../components/profile/ProfileSkills";
import ProfileAbout from "../../../../components/profile/ProfileAbout";
import DynamicShapes from "../../../../components/DynamicShapes";
import TypingEffectPersonalisable from "../../../../components/TypingEffectPersonalisable";
import Spinner from "../../../../components/Spinner";
import AnimatedSection from "../../../../components/AnimatedSection";
import styles from "../../../../styles/ProfilePage.module.css";

const Index = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isPrivate = true;

  useEffect(() => {
    setLoading(true);
    setError(null);

    const url = isPrivate
      ? "/api/my/profile"
      : "/api/public/profiles/";

    fetch(url, { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Erreur API");
        return res.json();
      })
      .then(data => setProfile(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [isPrivate]);

  if (loading || !user) {
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

  if (!profile) return <Navigate to="/NotFound" replace />;

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileHeader}>
        <DynamicShapes />
        <div className={styles.profileOverlay}>
          <TypingEffectPersonalisable name={profile.name} title={profile.title} />
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
