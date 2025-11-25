

"use client";

import React, { useEffect, useState } from 'react';
import { SVGMap } from '@/components/mapData/districtMapSVG';
import { voteData, districtVotePer,constituencies ,districts,voteDataConstituencies } from '@/components/mapData/dataset';
import { SVGMapConstitute } from '@/components/mapData/constituencyMapSVG';
import { ArrowLeft, ArrowRight, BarChart3, X } from 'lucide-react'
import { PartyVotes, ConstituencyVoteData, DistrictVoteData, DistrictVotePercent, District } from '@/components/mapData/type';
import Container from '@/components/ui/container';

export default function PollMap() {
  const [clickedDistrict, setClickedDistrict] = useState<string>('Chennai');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Chennai');
  const [selectedCons, setSelectedCons] = useState<string>('Shozhinganallur');
  const [districtPercentages, setDistrictPercentages] = useState<Record<string, { TVK: string; DMK: string; ADMK: string; total: number }>>({});
  const [constituencyPercentages, setConstituencyPercentages] = useState<Record<string,{ TVK: string; DMK: string; ADMK: string; total: number }>>({});
  const [isConstituencyView, setIsConstituencyView] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const selectedVoteData = isConstituencyView
  ? voteDataConstituencies[selectedCons]
  : voteData[selectedDistrict];

  const closeModal = () => {
    setShowModal(false);
    setModalData(null);
  };
  // Sample data structure - replace with your actual voteData
  
  const handleViewResult = () => {
    const currentRegion = isConstituencyView ? selectedCons : selectedDistrict;
    const data = isConstituencyView ? constituencyPercentages[currentRegion] : districtPercentages[currentRegion];
    const voteSource = isConstituencyView ? voteDataConstituencies : voteData;
    
    if (data) {
      setModalData({
        region: currentRegion,
        percentages: data,
        voteSource: voteSource[currentRegion]
      });
      setShowModal(true);
    }
  };

  const partyColors = {
    
    DMK: '#dc2626',
    BJP: '#f59e0b',
    TVK: '#10b981'
  };

  const calculateDistrictPercentages = (voteData: DistrictVoteData) => {
    const districtPercentages = {};

    Object.entries(voteData).forEach(([district, votes]) => {
      const total = votes.TVK + votes.BJP + votes.DMK;
      districtPercentages[district] = {
        TVK: ((votes.TVK / total) * 100).toFixed(1),
        BJP: ((votes.BJP / total) * 100).toFixed(1),
        DMK: ((votes.DMK / total) * 100).toFixed(1),
        total: total
      };
    });

    return districtPercentages;
  };
const calculateConstituencyPercentages = (voteDataConstituencies: ConstituencyVoteData) => {
  const constituencyPercentages = {};

  Object.entries(voteDataConstituencies).forEach(([constituency, votes]) => {
    if (!votes || votes.TVK === undefined || votes.BJP === undefined || votes.DMK === undefined) {
      console.warn(`Invalid vote data for ${constituency}`, votes);
      return;
    }

    const total = votes.TVK + votes.BJP + votes.DMK;
    constituencyPercentages[constituency] = {
      TVK: ((votes.TVK / total) * 100).toFixed(1),
      BJP: ((votes.BJP / total) * 100).toFixed(1),
      DMK: ((votes.DMK / total) * 100).toFixed(1),
      total,
    };
  });

  return constituencyPercentages;
};


  useEffect(() => {
    setDistrictPercentages(calculateDistrictPercentages(voteData))
    setConstituencyPercentages(calculateConstituencyPercentages(voteDataConstituencies));
  
  }, [])

  return (
    <Container className=" lg:flex flex-1 !h-screen ">
      {/* Left Side - Map (Non-scrollable) */}
      <div className="lg:!w-full !bg-white !relative">
        {/* <div className="lg:!absolute !top-0 !left-0 !right-0 !z-10 !bg-white !border-b !border-gray-200 !p-2 md:!p-4 lg:!p-6">
          <h1 className="!text-2xl !font-bold !text-gray-900 !mb-2">Tamil Nadu Election Results</h1>
       
            <div className="!bg-blue-50 !border !border-blue-200 !rounded-lg !p-4">
              <div className="!flex !justify-between !items-start !mb-2">
                <h3 className="!font-semibold !text-blue-900">
                  Selected District: {selectedDistrict}
                </h3>
                {isConstituencyView ? (
                    <button
                      onClick={() => setIsConstituencyView(false)}
                      className="!text-sm !text-blue-600 !font-medium !hover:underline"
                    >
                     <div className='!flex !items-center !gap-2'>
                        <ArrowLeft size={16} />
                        Back to Districts
                     </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsConstituencyView(true)}
                      className="!text-sm !text-blue-600 !font-medium !hover:underline"
                    >
                       <div className='!flex !items-center !gap-2'>
                        View Constituency 
                        <ArrowRight size={16} />
                     </div>
                    </button>
                  )}
              </div>

              <div className="!flex !gap-6 !text-sm !flex-wrap">
                {Object.entries(partyColors).map(([party, color]) => (
                  <div key={party} className="!flex !items-center !gap-2">
                    <div
                      className="!w-3 !h-3 !rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="!font-medium">{party}</span>
                    <span className="!text-gray-600">
                      {voteData[selectedDistrict] ? voteData[selectedDistrict][party] : 0} votes
                    </span>
                  </div>
                ))}
              </div>
            </div>

        </div> */}
        <div className="lg:!absolute !top-0 !left-0 !right-0 !z-10 !bg-white !border-b !border-gray-200 !px-1 !py-2 md:!px-2 md:!py-4 lg:!p-6">
          <h1 className="!text-lg md:!text-xl lg:!text-2xl !font-bold !text-gray-900 !mb-3">
            Tamil Nadu Election Results
          </h1>
          <div className="!bg-blue-50 !border !border-blue-200 !rounded-lg !p-3 md:!p-4">
            <div className="!flex !flex-col sm:!flex-row !justify-between !items-start !gap-2 !mb-3">
              <div className="!flex-1">
                <h3 className="!font-semibold !text-blue-900 !text-sm md:!text-base !mb-1">
                  Selected: {isConstituencyView ? selectedCons : selectedDistrict}
                </h3>
                <div className="!text-xs !text-blue-700">
                  Tap on map to view results
                </div>
              </div>
              
              <div className="!flex !gap-2">
                <button
                  onClick={() => setIsConstituencyView(!isConstituencyView)}
                  className="!text-xs md:!text-sm !text-blue-600 !font-medium !bg-white !border !border-blue-300 !rounded-md !px-3 !py-1.5 hover:!bg-blue-50 !transition-colors"
                >
                  <div className="!flex !items-center !gap-1.5">
                    {isConstituencyView ? (
                      <>
                        <ArrowLeft size={14} />
                        <span className="!hidden sm:!inline">Back to</span> Districts
                      </>
                    ) : (
                      <>
                        <span className="!hidden sm:!inline">View</span> Constituency
                        <ArrowRight size={14} />
                      </>
                    )}
                  </div>
                </button>
                
                <button
                  onClick={handleViewResult}
                  className="lg:!hidden !text-xs md:!text-sm !text-blue-600 !font-medium !bg-white !border !border-blue-300 !rounded-md !px-3 !py-1.5 hover:!bg-blue-50 !transition-colors"
                >
                  <div className="!flex !items-center !gap-1.5">
                    <BarChart3 size={14} />
                    <span className="!hidden sm:!inline">View</span> Result
                  </div>
                </button>
              </div>
            </div>
          </div>
           <div className="!grid !grid-cols-1 sm:!grid-cols-3 !gap-2 !text-xs md:!text-sm !mt-3">
              {/* {Object.entries(partyColors).map(([party, color]) => (
                <div key={party} className="!flex !items-center !justify-between sm:!justify-start !gap-2 !bg-white !rounded !px-2 !py-1.5 !border !border-blue-200">
                  <div className="!flex !items-center !gap-2">
                    <div
                      className="!w-3 !h-3 !rounded-full !border !border-white !shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="!font-medium !text-gray-800">{party}</span>
                  </div>
                  <span className="!text-gray-600 !font-medium sm:!hidden">
                    {voteData[selectedDistrict] ? (voteData[selectedDistrict][party] / 1000).toFixed(0) + 'k' : '0'}
                  </span>
                  <span className="!text-gray-600 !hidden sm:!inline">
                    {voteData[selectedDistrict] ? voteData[selectedDistrict][party].toLocaleString() : 0} votes
                  </span>
                </div>
              ))} */}
              {Object.entries(partyColors).map(([party, color]) => (
  <div
    key={party}
    className="!flex !items-center !justify-between sm:!justify-start !gap-2 !bg-white !rounded !px-2 !py-1.5 !border !border-blue-200"
  >
    <div className="!flex !items-center !gap-2">
      <div
        className="!w-3 !h-3 !rounded-full !border !border-white !shadow-sm"
        style={{ backgroundColor: color }}
      />
      <span className="!font-medium !text-gray-800">{party}</span>
    </div>
    <span className="!text-gray-600 !font-medium sm:!hidden">
      {selectedVoteData ? (selectedVoteData[party] / 1000).toFixed(0) + 'k' : '0'}
    </span>
    <span className="!text-gray-600 !hidden sm:!inline">
      {selectedVoteData ? selectedVoteData[party].toLocaleString() : '0'} votes
    </span>
  </div>
))}

            </div>
          </div>

          {!isConstituencyView ? (
            <div className="lg:!mt-56 !h-full !w-auto ">
            <SVGMap
              districts={districts}
              voteData={voteData}
              districtVotePer={districtVotePer}
              clickedDistrict={clickedDistrict}
              setClickedDistrict={setClickedDistrict}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
            />
            </div>
          ) : (
            <div className="lg:!mt-52 !h-full !w-auto flex justify-center">
            <SVGMapConstitute
              districts={constituencies}
              voteData={voteDataConstituencies}
              districtVotePer={districtVotePer}
              clickedDistrict={clickedDistrict}
              setClickedDistrict={setClickedDistrict}
              selectedCons={selectedCons}
              setSelectedCons={setSelectedCons}
            />
            </div>
          )}
        

      </div>

      {/* Right Side - Results (Scrollable) */}
  <div className="hidden lg:!flex lg:!w-2/5 !bg-white !border-l !border-gray-200 !flex-col">
    {/* Fixed Header */}
    <div className="!bg-white !border-b !border-gray-200 !p-6 !flex-shrink-0">
      <h2 className="!text-xl !font-bold !text-gray-900 !mb-4">{isConstituencyView ? 'Constituency-wise Results' : 'District-wise Results'}</h2>
      <div className="!grid !grid-cols-3 !gap-4 !text-sm">
        
        <div className="!flex !items-center !gap-2 !bg-red-50 !p-3 !rounded-lg">
          <div className="!w-4 !h-4 !bg-red-600 !rounded-full"></div>
          <span className="!font-medium">DMK</span>
        </div>
         <div className="!flex !items-center !gap-2 !bg-amber-50 !p-3 !rounded-lg">
          <div className="!w-4 !h-4 !bg-amber-500 !rounded-full"></div>
          <span className="!font-medium">BJP</span>
        </div>
        <div className="!flex !items-center !gap-2 !bg-emerald-50 !p-3 !rounded-lg">
          <div className="!w-4 !h-4 !bg-emerald-500 !rounded-full"></div>
          <span className="!font-medium">TVK</span>
        </div>
       
      </div>
    </div>

    {/* Scrollable Results */}
    <div className="!flex-1 !overflow-y-auto !p-6">
      <div className="!space-y-4">
        {(isConstituencyView ? Object.entries(constituencyPercentages) : Object.entries(districtPercentages)).map(
          ([region, percentages]) => {
            const isSelected = isConstituencyView ? selectedCons === region : selectedDistrict === region;
            const isClicked = clickedDistrict === region;
            const voteSource = isConstituencyView ? voteDataConstituencies : voteData;

            return (
              isSelected && (
                <div
                  key={region}
                  className="!bg-white !rounded-xl !border-2 !p-5 !transition-all !duration-300 !cursor-pointer hover:!shadow-lg !border-gray-200 hover:!border-gray-300 hover:!shadow-md"
                >
                  <div className="!flex !justify-between !items-center !mb-4">
                    <h3 className={`!font-bold !text-lg ${isClicked ? '!text-blue-900' : '!text-gray-900'}`}>
                      {region}
                    </h3>
                    <div className="!text-right">
                      <div className="!text-sm !text-gray-500">Total Votes</div>
                      <div className="!text-lg !font-bold !text-gray-900">{percentages.total}</div>
                    </div>
                  </div>

                  <div className="!space-y-3 !mb-4">
                    {Object.entries(partyColors).map(([party, color]) => (
                      <div key={party} className="!flex !items-center !justify-between">
                        <div className="!flex !items-center !gap-3">
                          <div
                            className="!w-4 !h-4 !rounded-full !shadow-sm"
                            style={{ backgroundColor: color }}
                          ></div>
                          <span className="!text-sm !font-semibold !text-gray-800">{party}</span>
                        </div>
                        <div className="!text-right">
                          <div className="!text-lg !font-bold !text-gray-900">
                            {percentages[party]}%
                          </div>
                          <div className="!text-xs !text-gray-500">
                            {voteSource?.[region]?.[party] ?? 0} votes
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="!space-y-2">
                    {Object.entries(partyColors).map(([party, color]) => (
                      <div key={party} className="!flex !items-center !gap-3">
                        <div className="!flex-1 !bg-gray-200 !rounded-full !h-3 !overflow-hidden">
                          <div
                            className="!h-full !rounded-full !transition-all !duration-500 !shadow-sm"
                            style={{ backgroundColor: color, width: `${percentages[party]}%` }}
                          ></div>
                        </div>
                        <span className="!text-xs !font-medium !text-gray-600 !w-12 !text-right">
                          {percentages[party]}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="!mt-4 !pt-3 !border-t !border-gray-200">
                    {(() => {
                      const winner = Object.entries(percentages)
                        .filter(([key]) => key !== 'total')
                        .reduce((a, b) => parseFloat(a[1] as string) > parseFloat(b[1] as string) ? a : b)[0];
                      return (
                        <div className="!flex !items-center !gap-2">
                          <div
                            className="!w-3 !h-3 !rounded-full"
                            style={{ backgroundColor: partyColors[winner] }}
                          ></div>
                          <span className="!text-sm !font-semibold !text-gray-700">Leading: {winner}</span>
                          <span className="!text-sm !text-gray-500">({percentages[winner]}%)</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )
            );
          }
        )}
      </div>
    </div>
  </div>

  {/* Mobile/Tablet Modal */}
  {showModal && modalData && (
    <div className="lg:!hidden !fixed !inset-0 !z-50 !bg-black !bg-opacity-50 !flex !items-end sm:!items-center !justify-center">
      {/* Modal Content */}
      <div className="!bg-white !w-full sm:!w-[90%] sm:!max-w-md sm:!rounded-2xl !rounded-t-2xl !max-h-[85vh] sm:!max-h-[80vh] !overflow-hidden !shadow-2xl">
        {/* Modal Header */}
        <div className="!bg-white !text-black !p-4 !flex !justify-between !items-center">
          <div>
            <h3 className="!text-lg !font-bold">Election Results</h3>
            <p className="!text-black !text-sm">{modalData.region}</p>
          </div>
          <button
            onClick={closeModal}
            className="!p-2 !hover:bg-blue-600 !rounded-full !transition-colors"
          >
            <X size={20} className="!text-black" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="!p-4 !overflow-y-auto !max-h-[70vh]">
          {/* Total Votes Summary */}
          <div className="!bg-gray-50 !rounded-lg !p-4 !mb-4 !text-center">
            <div className="!text-2xl !font-bold !text-gray-900">{modalData.percentages.total.toLocaleString()}</div>
            <div className="!text-sm !text-gray-600">Total Votes Cast</div>
          </div>

          {/* Party Results */}
          <div className="!space-y-4 !mb-4">
            {Object.entries(partyColors).map(([party, color]) => (
              <div key={party} className="!bg-white !border !border-gray-200 !rounded-lg !p-4">
                <div className="!flex !items-center !justify-between !mb-3">
                  <div className="!flex !items-center !gap-3">
                    <div
                      className="!w-5 !h-5 !rounded-full !shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                    <span className="!text-lg !font-bold !text-gray-800">{party}</span>
                  </div>
                  <div className="!text-right">
                    <div className="!text-xl !font-bold !text-gray-900">
                      {modalData.percentages[party]}%
                    </div>
                    <div className="!text-sm !text-gray-500">
                      {modalData.voteSource?.[party]?.toLocaleString() ?? 0} votes
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="!w-full !bg-gray-200 !rounded-full !h-4 !overflow-hidden">
                  <div
                    className="!h-full !rounded-full !transition-all !duration-700 !shadow-sm"
                    style={{ 
                      backgroundColor: color, 
                      width: `${modalData.percentages[party]}%` 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Winner Section */}
          <div className="!bg-green-50 !border !border-green-200 !rounded-lg !p-4 !mb-5">
            {(() => {
              const winner = Object.entries(modalData.percentages)
                .filter(([key]) => key !== 'total')
                .reduce((a, b) => parseFloat(a[1] as string) > parseFloat(b[1] as string) ? a : b)[0];
              return (
                <div className="!flex !items-center !justify-center !gap-3">
                  <div className="!flex !items-center !gap-2">
                    <div
                      className="!w-4 !h-4 !rounded-full"
                      style={{ backgroundColor: partyColors[winner] }}
                    />
                    <span className="!text-lg !font-bold !text-green-800">
                      {winner} Leading
                    </span>
                  </div>
                  <span className="!text-lg !font-bold !text-green-600">
                    {modalData.percentages[winner]}%
                  </span>
                </div>
              );
            })()}
          </div>
        </div>

      </div>
    </div>
  )}
    </Container>
  );
}

