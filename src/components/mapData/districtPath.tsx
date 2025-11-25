// District Component
import React from 'react';
import { DistrictProps } from '@/components/mapData/type';

export const District: React.FC<DistrictProps> = ({ 
  name, 
  pathData, 
  transform, 
  labelPosition, 
  isHovered,
  onMouseEnter, 
  onMouseLeave, 
  onClick 
}) => {
  return (
    <g>
      {/* District Path */}
      <path
        d={pathData}
        fill={isHovered ? "#ccac00" : "#f0f0f0"}
        fillOpacity={1}
        stroke="#333"
        strokeWidth={1}
        paintOrder="fill"
        strokeOpacity={1}
        strokeDasharray=""
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        transform={transform}
        // transform="matrix(2.149999976158142,0,0,2.149999976158142,-67.49996185302734,-45.00000762939453)"
        clipPath="none"
        style={{
        
          cursor: "pointer",
          transition: "fill 0.2s ease"
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
      
      {/* District Name */}
      <text
        transform={`matrix(0.5778 -0.8162 0.8162 0.5778 ${labelPosition.x} ${labelPosition.y})`}
        style={{
          fontFamily: "'Tahoma'",
          fontSize: 11,
          fill: "#000",
          pointerEvents: "none"
        }}
        className="maplabels1"
      >
        {name}
      </text>
      
    </g>
  );
};


