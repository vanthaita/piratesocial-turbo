import React from 'react';

const ProfilePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Profile Header */}
      <div className="bg-blue-600 w-full p-6 shadow-md">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile Picture"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
            />
            <div className="absolute top-0 right-0 bg-blue-500 p-1 rounded-full cursor-pointer transform translate-x-1/4 translate-y-1/4">
              <span className="text-white text-xs">Edit</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-4">John Doe</h1>
          <p className="text-gray-300 text-lg">@johndoe</p>
          <p className="text-gray-200 mt-2 text-center max-w-2xl">
            This is a user bio. A little description about the user goes here to tell followers more about them.
          </p>
        </div>
      </div>

      {/* User Stats */}
      <div className="w-full max-w-4xl px-6 py-4 bg-white mt-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <button className="text-gray-700 font-semibold py-2 px-4 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-300">
            Tweets
          </button>
          <button className="text-gray-700 font-semibold py-2 px-4 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-300">
            Followers
          </button>
          <button className="text-gray-700 font-semibold py-2 px-4 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-300">
            Following
          </button>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="w-full max-w-4xl px-6 py-4">
        {/* Sample Content for Tweets */}
        <div className="mt-4">
          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-xl font-semibold text-gray-800">Tweets</h2>
            <div className="mt-4 space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                <p className="font-semibold text-gray-800">John Doe</p>
                <p className="text-gray-600 text-sm mb-2">@johndoe · 2h</p>
                <p className="text-gray-700">This is a sample tweet. It&apos;s short, engaging, and gets to the point!</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
                <p className="font-semibold text-gray-800">John Doe</p>
                <p className="text-gray-600 text-sm mb-2">@johndoe · 5h</p>
                <p className="text-gray-700">Another insightful tweet. Follow for updates and more tweets like this!</p>
              </div>
              {/* Add more tweets as needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
