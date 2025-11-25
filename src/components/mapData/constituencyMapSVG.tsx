import React, { useState, useRef } from 'react';
import { Marker } from './Marker';
import { Tooltip } from './TooltipCons';
import { Constitute } from './constituencyPath';
import { SVGMapConstituencyProps } from '@/components/mapData/type';

// Main SVG Map Component
export const SVGMapConstitute: React.FC<SVGMapConstituencyProps> =({ districts, voteData, districtVotePer,clickedDistrict,setClickedDistrict, setSelectedCons  }) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
 
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
    const newDistrict = clickedDistrict === district ? null : district;
    setClickedDistrict(newDistrict);
    setSelectedCons(newDistrict);
  };

  return (
    <div style={{ 

}}>


      <svg
          ref={svgRef}
          xmlns="http://www.w3.org/2000/svg"
          baseProfile="full"
          width="100%"
          height="80vh"
          style={{
            
            backgroundColor: "#fff",
            display: 'block',
    margin: '0 auto',
    zIndex:2
          }}
          onMouseMove={handleMouseMove}
        >
          
          {/* Filter definitions */}
        
          
          
           {districts.map((district: any, index) => (
                    <Constitute
                      key={index}
                      name={district.name}
                      pathData={district.pathData}
                      transform={district.transform}
                      color={district.color}
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
        </svg>
{/* <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="288pt" height="558.724263pt" viewBox="0 0 288 558.724263" version="1.1">

 <defs>
 </defs>

 <defs>
  <clipPath id="peb72c19f0d">
   <rect x="0" y="0" width="288" height="558.724263"/>
  </clipPath>
 </defs>
</svg> */}
   
      
      {/* Tooltip */}
      <div className="hidden lg:block">
        <Tooltip 
          district={hoveredDistrict} 
          mousePosition={mousePosition} 
          voteData={voteData} 
        />
      </div>
      
    </div>
  );
};