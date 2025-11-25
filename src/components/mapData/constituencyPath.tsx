// District Component
import React from 'react';
import { ConstituencyProps } from '@/components/mapData/type';

export const Constitute: React.FC<ConstituencyProps> =  ({ 
  name, 
  pathData, 
  transform, 
  color,
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
        fill={isHovered ? "#ccac00" : `#${color}`}
        fillOpacity={1}
        stroke="#333"
        strokeWidth={1}
        paintOrder="fill"
        strokeOpacity={1}
        strokeDasharray=""
        strokeLinecap="butt"
        strokeLinejoin="miter"
        strokeMiterlimit={10}
        clipPath="none"
        style={{
          cursor: "pointer",
          transition: "fill 0.2s ease"
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
      />
      
      {/* District Name - Only text rotated */}
      <text
        x={labelPosition.x}
        y={labelPosition.y}
        transform={`rotate(${transform}, ${labelPosition.x}, ${labelPosition.y})`}
        style={{
          fontFamily: "'Tahoma'",
          fontSize: 11,
          fontWeight:'normal',
          fill: "#000",
          pointerEvents: "none"
        }}
        textAnchor="middle"
        dominantBaseline="middle"
        className="maplabels1"
      >
        {name}
      </text>
      
    </g>
  );
};