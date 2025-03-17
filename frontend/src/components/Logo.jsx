import React from 'react';

const Logo = ({ color = "#000", width = "40px", height = "40px" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height}>
    <path
      d="M12 2L2 7h4v7h4V7h4l-10 5z"
      fill={color} // Utilisation de la prop color pour changer la couleur
    />
  </svg>
);

export default Logo;
