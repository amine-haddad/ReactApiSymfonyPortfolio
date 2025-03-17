import { useState } from "react";
import ProjectCard from "./ProjectCard";

const Carousel = ({ projects }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div className="carousel-wrapper">
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          project={project}
          index={index}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      ))}
    </div>
  );
};

export default Carousel;
