import React from 'react';
import '../styles/Loader.css';

const Loader = () => (
  <div className="loader-container">
    <img src={process.env.PUBLIC_URL + '/favicon.ico'} alt="Loading..." className="loader-logo" />
  </div>
);

export default Loader; 