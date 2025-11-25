export type PartyVotes = {
  TVK: number;
  BJP: number;
  DMK: number;
};

export type ConstituencyVoteData = {
  [constituencyName: string]: PartyVotes;
};

export type DistrictVoteData = {
  [district: string]: PartyVotes;
};

export type DistrictVotePercent = {
  [districtName: string]: string; 
};

export type District = {
  name: string;
  pathData: string;
  transform?: string;
  labelPosition?: { x: number; y: number };
  markerPosition?: { x: number; y: number };
};

export type DistrictProps = {
  name: string;
  pathData: string;
  transform: string;
  labelPosition: {
    x: number;
    y: number;
  };
  isHovered: boolean;
    isClicked: boolean;
  onMouseEnter: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseLeave: () => void;
  onClick: () => void;
};

export type ConstituencyProps = {
  name: string;
  pathData: string;
  transform: string;
  color: string;
  labelPosition: {
    x: number;
    y: number;
  };
  isHovered: boolean;
    isClicked: boolean;
  onMouseEnter: (e: React.MouseEvent<SVGPathElement>) => void;
  onMouseLeave: () => void;
  onClick: () => void;
};

export type SVGMapConstituencyProps = {
  districts: District[];
  voteData: ConstituencyVoteData;
  districtVotePer: Record<string, string>;
  clickedDistrict: string | null;
  setClickedDistrict: (name: string | null) => void;
   selectedCons: string;
  setSelectedCons: (district: string) => void;
};

export type SVGMapDistrictProps = {
  districts: District[]; 
  voteData: DistrictVoteData;
  districtVotePer: DistrictVotePercent;
  clickedDistrict: string;
  setClickedDistrict: (district: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;
};