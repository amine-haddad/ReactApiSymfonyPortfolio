// src/components/Error.js
import React from 'react';

const Error = ({ message }) => {
  return (
    <p className="text-danger text-center">{message}</p>
  );
};

export default Error;
