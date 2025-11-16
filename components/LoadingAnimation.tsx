import React from 'react';

const LoadingAnimation: React.FC = () => {
  return (
    <div className="loading-container">
      <img
        src="https://i.ibb.co/wZW4zgyp/mca.png"
        alt="Menofia Courses Academy Logo"
        className="loading-logo"
      />
      <div className="relative flex justify-center items-center">
          <div className="pacman-loader">
              <div className="pacman-top"></div>
              <div className="pacman-bottom"></div>
          </div>
          <div className="dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
          </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;