import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import Profile from "../../../components/profile/Profile";
import ProfileProjects from "../../../components/profile/ProfileProjects";
import ProfileExperiences from "../../../components/profile/ProfileExperiences";
import ProfileSkills from "../../../components/profile/ProfileSkills";
import ProfileAbout from "../../../components/profile/ProfileAbout";
import DynamicShapes from "../../../components/DynamicShapes";
import TypingEffect from "../../../components/TypingEffect";
import styles from "../../../styles/ProfilePage.module.css"; // Importation du fichier CSS dédié

const Index = () => {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {


    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("jwt_token");
        const response = await axios.get(`/api/profiles/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Erreur de chargement du profil :", err);
        setError("Impossible de charger le profil.");
      } finally {
        setLoading(false);
      }
    };

    if (profileId) fetchProfile();
  }, [profileId]);

  console.log("Profil chargé :", profile);
  if (loading) return <p className={styles.profileLoading}>Chargement...</p>;
  if (error) return <p className={styles.profileError}>Erreur : {error}</p>;
  if (!profile) return <p className={styles.profileNotFound}>Profil non trouvé</p>;

  return (
    <div className={styles.profilePage}>
      {/* Effets DynamicShapes et TypingEffect */}
      <div className={styles.profileHeader}>
        <DynamicShapes />
        <div className={styles.profileOverlay}>
          <TypingEffect />
        </div>
      </div>
      <div className={styles.profileContent}>
        <Profile profile={profile} />
        <ProfileProjects projects={profile.projects || []} />
        <ProfileExperiences experiences={profile.experiences || []} />
        <ProfileSkills skills={profile.profileSkills || []} />
        <ProfileAbout profile={profile || []} />
      </div>
    </div>
  );
};

export default Index;
