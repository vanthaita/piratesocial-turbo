'use client'
import React from 'react';
import Image from 'next/image';
import { ArrowDown, ArrowLeftRight, ArrowUp, Heart, XIcon } from 'lucide-react'; // Using Lucide for icon

interface ReelStoryProps {
  reels: Array<{ name: string; videoSrc: string; imgSrc: string }>;
  currentReelIndex: number;
  setShowReel: (show: boolean) => void;
  nextReel: () => void;
  prevReel: () => void;
}

const ReelStory: React.FC<ReelStoryProps> = ({ reels, currentReelIndex, setShowReel, nextReel, prevReel }) => {
  const currentReel = reels[currentReelIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center h-screen w-full">
      <div className='relative h-full w-full max-w-md items-start flex justify-between'>
        <div className="relative h-full w-full items-center flex justify-between gap-x-2">
  

          <div className="relative h-[80%] w-full rounded-md">
            <video 
              className="w-full h-full object-cover rounded-md" 
              src={currentReel.videoSrc} 
              autoPlay 
              controls 
            />
            <div className="absolute bottom-8 left-4 bg-black bg-opacity-50 text-white p-2 rounded">
              <p>Ronaldo.</p>
            </div>
          </div> 
          
          <div className='h-[80%] flex flex-col items-start justify-between'>
            <button className="  z-20 ml-7 mt-1 text-gray-300" onClick={() => setShowReel(false)}>
              <XIcon />
            </button>
            <div className="flex flex-col items-center space-y-4 mt-20">
              <div className='flex flex-col justify-center items-center'>
              <div className="">
                    <button className="text-white" onClick={prevReel}>
                    <ArrowUp />
                    </button>
                  </div>
                  <div className="">
                    <button className="text-white" onClick={nextReel}>
                    <ArrowDown />
                    </button>
                  </div>  
              </div>
                <Image 
                  src={currentReel.imgSrc} 
                  alt={currentReel.name} 
                  width={48} 
                  height={48} 
                  className="rounded-full border-2 border-white" 
                />
                <div className="text-white text-sm text-center">
                  <p>{currentReel.name}</p>
                  <button className="text-sm text-white border border-white px-2 py-1 rounded mt-2">Follow</button>
                </div>

                <button 
                  className="flex items-center space-x-2 text-white bg-transparent"
                >
                  <Heart className="text-red-500" />
                  <span>425K</span>
                </button>

                <button className="text-white">💬 3,255</button>
              </div>
        </div>


        </div>
        
      </div>
    </div>
  );
};

export default ReelStory;
