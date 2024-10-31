import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface MyProfileProps {
  showMyProfile: boolean;
  setShowMyProfile: React.Dispatch<React.SetStateAction<boolean>>;
  isShowOptionProfile: boolean;
  setIShowOptionProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyProfile: React.FC<MyProfileProps> = ({ showMyProfile, setShowMyProfile ,isShowOptionProfile, setIShowOptionProfile}) => {
  if (!showMyProfile) return null; 

  return (
    <aside className="bg-white shadow-md overflow-y-auto fixed sidebar z-20 w-full h-full">
      <div className="flex justify-between px-6 py-4 items-center mb-4 border-b">
      <h2 className="text-xl font-semibold text-gray-700">Profile</h2>
        <ArrowLeft
          onClick={() => {
            setShowMyProfile(false)
            setIShowOptionProfile(false)
          }} 
          className="cursor-pointer w-6 h-6 text-gray-600 hover:text-gray-800 transition-all duration-300" 
        />
      </div>
      <div className="px-6">
        <h3 className="text-lg font-semibold mb-2">Avatar</h3>
        <div className="flex items-center gap-x-2 mb-4">
          <div className="flex items-center rounded-full p-4 bg-black"></div>
          <button className="text-blue-500 hover:underline">Change Image</button>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Basic Info</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your username" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Tell us about yourself"></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Birthday</label>
            <input type="date" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Posts</h3>
          <div className="flex flex-col">
            <div className="border-b pb-2 mb-2">
              <p className="text-sm text-gray-600">This is a sample post content.</p>
              <button className="text-sm text-blue-500 hover:underline mt-2">Edit</button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Archived Posts</h3>
          <div className="flex flex-col">
            <div className="border-b pb-2 mb-2">
              <p className="text-sm text-gray-600">This is a sample archived post content.</p>
              <button className="text-sm text-blue-500 hover:underline mt-2">Restore</button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Your Channel</h3>
          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Enter your channel name" />
        </div>

      </div>
    </aside>
  );
};

export default MyProfile;
