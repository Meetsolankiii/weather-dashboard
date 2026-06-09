import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner"></div>
      <p>Fetching weather report...</p>
    </div>
  );
};

export default Loader;