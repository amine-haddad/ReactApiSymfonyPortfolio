import { Link } from "react-router-dom";
function User({user}) {
  return (
    <div className="user-profile">
      <h1>Bienvenue, {user.name}</h1>
      <p>Email : {user.email}</p>
      <p>Rôle : {user.roles}</p>
      <p>Firstname : {user.first_name}</p>
      <p>Lastname : {user.last_name}</p>
      {user.userProfiles && (
        <>
          {user.userProfiles.map((profile) => (
            <li key={profile.id}>
              <Link to={`/profile/${profile.id}`}>{profile.name}</Link>
              
              <p>titre du profile : {profile.title}</p>
              <p>bio du profile: {profile.bio}</p>
            </li>
          ))}
        </>
      )}


    </div>
  );
}

export default User;
