import React, { useState, useRef, useEffect } from 'react';
import { District } from './districtPath';
import { Marker } from './Marker';
import { TooltipDis } from './TooltipDis';
import { SVGMapDistrictProps } from './type';

// Main SVG Map Component
export const SVGMap: React.FC<SVGMapDistrictProps> =({ 
  districts, 
  voteData, 
  clickedDistrict,
  setClickedDistrict,
  setSelectedDistrict 
 }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

const getResponsiveOffset = (): { x: number; y: number } => {
  const width = window.innerWidth;

  if (width <= 400) {
    // Mobile M
    return { x: -285, y: 20 };
  } else if (width <= 500) {
    // Mobile L
    return { x: -260, y: 20 };
  } else if (width <= 800) {
    // Tablet
    return { x: -100, y: 0 };
  } else {
    // Desktop
    return { x: 0, y: 0 };
  }
};

useEffect(() => {
  const handleResize = () => {
    setOffset(getResponsiveOffset());
  };

  handleResize(); // set initial offset
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);

 
  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleMouseEnter = (district: string, event: React.MouseEvent<SVGPathElement, MouseEvent>) => {
    setHoveredDistrict(district);
    updateMousePosition(event);
  };

  const handleMouseLeave = () => {
    setHoveredDistrict(null);
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (hoveredDistrict) {
      updateMousePosition(event);
    }
  };


  const updateMousePosition = (event: React.MouseEvent) => {
    const rect = svgRef.current.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  };

  const handleClick = (district: string) => {
     // Update both states to keep them in sync
    const newDistrict = clickedDistrict === district ? null : district;
    setClickedDistrict(newDistrict);
    setSelectedDistrict(newDistrict);
  };

  return (
    <div>

      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        baseProfile="full"
        width="100%"
        height="100vh"
        style={{
          
          backgroundColor: "#fff",
          display: 'block',
          margin: '0 auto',
          
        }}
        onMouseMove={handleMouseMove}
      >
        
        {/* Filter definitions */}
        <defs>
          <filter id="f1" x="-100%" y="-100%" width="1000%" height="1000%">
            <feOffset
              result="offOut"
              in="SourceGraphic"
              dx={-9.799999999999999}
              dy={9.799999999999999}
            />
            <feColorMatrix
              result="matrixOut"
              in="offOut"
              type="matrix"
              values="0.2 0 0 0 0 0 0.2 0 0 0 0 0 0.2 0 0 0 0 0 1 0"
            />
            <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation={8} />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>
        
        <g transform={`translate(${offset.x}, ${offset.y})`}>
      {/* Render Districts */}
        {districts.map((district, index) => (
          <District
            key={index}
            name={district.name}
            pathData={district.pathData}
            transform={district.transform}
            labelPosition={district.labelPosition}
            isHovered={hoveredDistrict === district.name}
            isClicked={clickedDistrict === district.name}
            onMouseEnter={(e) => handleMouseEnter(district.name, e)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(district.name)}
          />
        ))}
        
        {/* Render Markers */}
        {districts.map((district: any, index) => (
          <Marker
            key={`marker-${index}`}
            x={district.markerPosition.x}
            y={district.markerPosition.y}
            isVisible={clickedDistrict === district.name}
          />
        ))}
        </g>
      </svg>
      
      {/* Tooltip */}
     <div className="hidden lg:block">
      <TooltipDis 
        district={hoveredDistrict} 
        mousePosition={mousePosition} 
        voteData={voteData} 
      />
    </div>

    </div>
  );
};