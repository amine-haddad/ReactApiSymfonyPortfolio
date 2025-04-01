// src/components/ProjectCard.js
import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="card project-card">
      <img
        src={project.image || "/assets/defaultImgageCode.jpg"}
        alt={project.title}
        className="card-img-top project-img-top"
      />
      <div className="card-body project-body">
        <h5 className="card-title project-title">{project.title}</h5>
        <p className="card-text project-text">{project.description}</p>

        {/* Affichage des technologies si elles existent */}
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

        {/* Lien vers le projet s'il existe */}
        {project.id && (
          <a
            href={project.name}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary w-100"
          >
            Voir le projet
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
