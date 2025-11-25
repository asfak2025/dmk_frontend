// Tooltip Component
import React from 'react';

export const Tooltip = ({ district, mousePosition, voteData }) => {
  console.log("districts ===>", district)
  if (!district || !voteData[district]) return null;

  const data = voteData[district];
  const tooltipContent = Object.entries(data)
    .map(([party, votes]) => `${party}: ${votes}`)
    .join(', ');

  return (
    <div
      style={{
        position: 'absolute',
        left: mousePosition.x + 300,
        top: mousePosition.y + 160,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        pointerEvents: 'none',
        zIndex: 1000,
        whiteSpace: 'nowrap'
      }}
    >
      {district}: {tooltipContent}
      {console.log(district,tooltipContent)}
    </div>
  );
};