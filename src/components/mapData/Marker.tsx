import React from 'react';

export const Marker = ({ x, y, isVisible }) => {
  if (!isVisible) return null;

  return (
    <circle
      cx={x}
      cy={y}
      r={8}
      fill="red"
      stroke="white"
      strokeWidth={2}
      style={{
        filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
      }}
    />
  );
};
