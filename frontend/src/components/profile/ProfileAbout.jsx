import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS
import styles from "../../styles/Profile.module.css"; // Import du fichier CSS
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const ProfileAbout = ({ profile, error }) => {

  if (error) return <p>Erreur : {error}</p>; // on prend le premier profil pour afficher
  return (
    <>
      <div className={"profileContainer" + " " + styles.profileContainer}>
        <h2 className="text-center mb-2 col-10 mx-auto title-h2 display-1">
          About
        </h2>
        <div className={styles.profileCard}>
          <div className={styles.profileCardBody}>
            <div className="row">
              <div className="col-md-6">
                <h1 className={styles.profileCardTitle}>{profile.name}</h1>
                <p><strong>Title:</strong> {profile.title}</p>
                <p><strong>Bio:</strong> {profile.bio}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
                <p><strong>GitHub:</strong> <a href={profile.github_url}>{profile.github_url}</a></p>
                <p><strong>LinkedIn:</strong> <a href={profile.linkedin_url}>{profile.linkedin_url}</a></p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileAbout;
