import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Import Bootstrap JS
import "../../styles/Profile.css"; // Import du fichier CSS
import ProfileCarousel from "./ProfileCarousel";

const Profile = ({ profile, error }) => {
  return (
    <>
      <div className="profile-container ">
        {/* Full-screen card with profile info and carousel */}
        <h2 className="text-center mb-2 col-10 mx-auto title-h2 display-1">
          Welcome to my Portfolio
        </h2>

        <div className="profile-card">
          <div className="profile-card-body">
            <div className="row">
              <div className="col-md-6">
                <h1 className="profile-card-title">{profile.name}</h1>
                <p>
                  <strong>Title:</strong> {profile.title}
                </p>
                <p>
                  <strong>Bio:</strong> {profile.bio}
                </p>
                <p>
                  <strong>Email:</strong> {profile.email}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.phone}
                </p>
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a href={profile.github_url}>{profile.github_url}</a>
                </p>
                <p>
                  <strong>LinkedIn:</strong>{" "}
                  <a href={profile.linkedin_url}>{profile.linkedin_url}</a>
                </p>
              </div>
              {/* Carousel in the right side of the card */}
              <ProfileCarousel profile={profile} error={error} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
