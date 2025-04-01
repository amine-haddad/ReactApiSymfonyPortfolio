import React from 'react';
import './DynamicLine.css';  // Importation du fichier CSS

const DynamicLine = ({ isActive }) => {
  return (
    <span className={`dynamic-line ${isActive ? 'active' : ''}`} />
  );
};

export default DynamicLine;
