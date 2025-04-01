import "../../styles/Project.css";

const ProfileProjects = ({profile, error}) => {
  return (
    <div className="container-fluid section-project">
      <h2 className="text-center mb-2 col-10 mx-auto title-h2 display-1">Projects</h2>

      {/* Affichage de l'erreur si elle existe */}
      {error && <p className="text-danger text-center">{error}</p>}

      {/* Wrapper pour les cartes avec défilement horizontal */}
      <div className="carousel-wrapper">
        {profile.projects.length > 0
          ? profile.projects.map((project, index) => (
              <div
                key={index}
                className="card project-card col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"
              >
                <img
                  src={project.image || "/assets/defaultImgageCode.jpg"}
                  alt={project.title}
                  className="card-img-top project-img-top"
                />
                <div className="card-body project-body">
                  <h5 className="card-title project-title">{project.title}</h5>
                  <p className="card-text project-text">{project.description}</p>

                  {project.technologies?.length > 0 && (
                    <div className="mb-3 card-footer project-footer">
                      <strong>Technologies :</strong>
                      <div className="d-flex flex-wrap gap-1">
                        {project.technologies.map((techno, i) => (
                          <span key={i} className="badge bg-primary text-xs">
                            {techno.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {project.id && (
                    <a
                      href={project.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary w-100"
                    >
                      Voir le projet
                    </a>
                  )}
                </div>
              </div>
            ))
          : !error && (
              <p className="text-center text-muted">Aucun projet trouvé.</p>
            )}
      </div>
    </div>
  );
};

export default ProfileProjects;
