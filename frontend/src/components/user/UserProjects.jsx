function UserProjects({profiles}) {
  return (
    <div className="user-profile">
      
      <h1>Liste des Composants Projects</h1>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>
            <h3>{profile.name}</h3> {/* Affichage du nom du profil */}
            {/* Vérifier si le profil a des projets */}
            {profile.projects && profile.projects.length > 0 ? (
              <ul>
                {profile.projects.map((project) => (
                  <li key={project.id}>{project.title}</li> // Affichage des projets
                ))}
              </ul>
            ) : (
              <p>Aucun projet trouvé.</p> // Message si pas de projets
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserProjects;
