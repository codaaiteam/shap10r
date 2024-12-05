import React from 'react';

const GameShape = ({ shape, color }) => {
  const shapeStyles = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const getShape = () => {
    switch (shape) {
      case 'heart':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24" fill={color}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      case 'circle':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <circle cx="12" cy="12" r="10" fill={color} />
          </svg>
        );
      case 'square':
        return (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <rect x="2" y="2" width="20" height="20" fill={color} />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div style={shapeStyles}>
      {getShape()}
    </div>
  );
};

export default GameShape;