/* eslint-disable @next/next/no-img-element */
'use client';

import FeedPost from '@/components/feed/FeedPost';
import { ScrollArea } from '@/components/ui/scroll-area';
import axiosInstance from '@/helper/axiosIntance';
import { caltimeAgo } from '@/lib/timeAgo';
import { Comment } from '@/types';
import React, { useEffect, useState } from 'react';
const tabs = ['Posts', 'Followers', 'Following'];

type User = {
  id: number;
  name: string;
  email: string;
  givenName: string;
  familyName: string;
  picture: string;
  providerId: string;
  lastActiveAt: string | null;
  status: string;
  createdAt: string;
  followers: { follower: { id: number; name: string; picture: string, providerId: string } }[];
  following: any[];
  feedPosts: {
    id: number;
    userId: number;
    content: string;
    imagesUrl: string[];
    createdAt: string;
    likesCount: number;
    comments: Comment[];
  }[];
};

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Posts');

  useEffect(() => {
    const handleGetUserInfo = async () => {
      try {
        const response = await axiosInstance('users/1');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    handleGetUserInfo();
  }, []);

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="bg-blue-600 w-full p-6 shadow-md">
        <div className="flex flex-col items-center">
          <img
            src={user.picture || 'https://via.placeholder.com/150'}
            alt="Profile Picture"
            className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
          />
          <h1 className="text-3xl font-bold text-white mt-4">{user.name}</h1>
          <p className="text-gray-300 text-lg">@{user.providerId}</p>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <div className="flex justify-around border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 text-lg font-semibold ${
                activeTab === tab
                  ? 'text-blue-600 border-b-4 border-blue-600'
                  : 'text-gray-700 hover:text-blue-600 hover:border-b-4 hover:border-blue-600'
              } transition duration-300`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="">
          {activeTab === 'Posts' && (
            <ScrollArea
            id="scroll-area"
             className="flex-1 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
          >
            <div>
              {user.feedPosts.map((post, index) => (
                <FeedPost 
                  key={index} 
                  id={post.id}
                  content={post.content}
                  imagesUrl={post.imagesUrl}
                  createdAt={post.createdAt}
                  userId={post.userId}
                  user={user}
                  likesCount={post.likesCount}
                  commentsCount={0}
                  retweetsCount={0}
                  comments={post.comments}
                />
              ))}
              {/* {loading && <p className="text-center my-4 text-gray-500">Loading...</p>}
              {!hasMore && !loading && (
                <p className="text-center my-4 text-gray-500">No more posts to display.</p>
              )}
              <div ref={lastPostRef} className="h-1" /> */}
            </div>
          </ScrollArea>
          )}

          {activeTab === 'Followers' && (
            <div className="grid grid-cols-1 gap-4">
              {user.followers.map(({ follower }) => (
                <div
                  key={follower.id}
                  className="flex items-center space-x-4 border-b border-gray-300 px-6 py-4"
                >
                  <img
                    src={follower.picture || 'https://via.placeholder.com/50'}
                    alt={follower.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className='flex flex-col'>
                    <p className="font-semibold text-gray-800">{follower.name}</p>
                    <p className="font-semibold text-gray-500">@{follower.providerId}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Following' && (
            <div className="text-center">
              <p className="text-gray-700">Feature Coming Soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;