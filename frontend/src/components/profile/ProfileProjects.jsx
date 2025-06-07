import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/Project.module.css";

const ProfileProjects = ({ projects }) => {
  return (
    <div className={`container-fluid ${styles["sectionProject"]}`}>
      <h2 className={`text-center mb-2 col-10 mx-auto ${styles["titleH2"]} display-1`}>
        Projects
      </h2>

      <div className={styles["carouselWrapper"]}>
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <div
              key={index}
              className={`card ${styles["projectCard"]} col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2`}
            >
              <img
                src={project.image || "/assets/defaultImgageCode.jpg"}
                alt={project.title}
                className={`card-img-top ${styles["projectImgTop"]}`}
              />
              <div className={`card-body ${styles["projectBody"]}`}>
                <h5 className={`card-title ${styles["projectTitle"]}`}>{project.title}</h5>
                <p className={`card-text ${styles["projectText"]}`}>{project.description}</p>
                {project.technologies?.length > 0 && (
                  <div className={`mb-3 card-footer ${styles["projectFooter"]}`}>
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
                {project.project_url && (
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
        ) : (
          <p className="text-center text-muted">Aucun projet trouvé.</p>
        )}
      </div>
    </div>
  );
};

export default ProfileProjects;
