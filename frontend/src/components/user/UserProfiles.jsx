import { Link } from "react-router-dom";

function UserProfiles({profiles}) {


  return (
    <div className="user-profile">
      <h1>Liste des composants Profiles</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>
            <Link to={`/profile/${profile.id}`}>{profile.name}</Link>
            {console.log({ log: profile.projects })}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserProfiles;
