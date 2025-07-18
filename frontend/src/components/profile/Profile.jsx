import styles from "../../styles/Profile.module.css";
import ProfileCarousel from "./ProfileCarousel";

const Profile = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-center">

      <div className={`${styles.profileContainer} my-5 col-10`}>
        <div className={styles.profileCardBody}>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Bio:</strong> {profile.bio}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Phone:</strong> {profile.phone}</p>
              <p><strong>GitHub:</strong> <a href={profile.github_url}>{profile.github_url}</a></p>
              <p><strong>LinkedIn:</strong> <a href={profile.linkedin_url}>{profile.linkedin_url}</a></p>
            </div>
            <div className="col-md-6 p-4 m-auto">
              <ProfileCarousel profile={profile} error={null} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
