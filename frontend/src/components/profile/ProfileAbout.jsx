import styles from "../../styles/Profile.module.css";

const ProfileAbout = ({ profile, error }) => {
  if (error) return <p>Erreur : {error}</p>;
  if (!profile) return null;

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center">
      <h2 className={`mb-4 display-4 ${styles.titleH2}`}>About</h2>
      <div className={`${styles.profileContainer} my-5 col-10`}>
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
  );
};

export default ProfileAbout;
