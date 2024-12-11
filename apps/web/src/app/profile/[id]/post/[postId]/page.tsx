'use client'
import React from 'react';

interface User {
  id: number;
  name: string;
  providerId: string;
  picture?: string;
}

interface Comment {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  user: User;
}

interface PostData {
  id: number;
  userId: number;
  content: string;
  imagesUrl: string[];
  createdAt: string;
  user: User;
  likes: any[]; // Consider refining the type if possible
  comments: Comment[];
  commentsCount: number;
  likesCount: number;
  retweetsCount: number;
}

interface PostViewProps {
  post: PostData;
}

const testPost: PostData = {
  id: 1,
  userId: 123,
  content: "This is a sample tweet for testing the UI. #testing #UI #React",
  imagesUrl: [
    "https://via.placeholder.com/400x200",
    "https://via.placeholder.com/400x200",
    "https://via.placeholder.com/400x200"
  ],
  createdAt: new Date().toISOString(),
  user: {
    id: 123,
    name: "John Doe",
    providerId: "provider_123",
    picture: "https://via.placeholder.com/40"
  },
  likes: [{ userId: 124 }, { userId: 125 }],
  comments: [
    {
      id: 1,
      userId: 124,
      content: "Great post! Very informative.",
      createdAt: new Date().toISOString(),
      user: {
        id: 124,
        name: "Jane Smith",
        providerId: "provider_124",
        picture: "https://via.placeholder.com/40"
      }
    },
    {
      id: 2,
      userId: 125,
      content: "Thanks for sharing this!",
      createdAt: new Date().toISOString(),
      user: {
        id: 125,
        name: "Alice Brown",
        providerId: "provider_125",
        picture: "https://via.placeholder.com/40"
      }
    }
  ],
  commentsCount: 2,
  likesCount: 2,
  retweetsCount: 5
};

const PostView: React.FC<PostViewProps> = ({ post = testPost }) => {
  // Check if the post object and its properties are defined
  if (!post || !post.user) {
    return <div>Loading...</div>; // Fallback UI if the post data is incomplete
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toLocaleString() : 'Invalid date';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-xl mx-auto mb-4">
      {/* User header */}
      <div className="flex items-center mb-3">
        <img
          src={post.user.picture || 'https://via.placeholder.com/40'}
          alt={`Profile picture of ${post.user.name}`}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <p className="font-semibold text-gray-800">{post.user.name}</p>
          <p className="text-gray-500 text-sm">{formatDate(post.createdAt)}</p>
        </div>
      </div>

      {/* Post content */}
      <p className="text-gray-800 mb-3">{post.content}</p>

      {/* Images section */}
      {post.imagesUrl.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {post.imagesUrl.map((url, index) => (
            <img key={index} src={url} alt={`Post image ${index}`} className="rounded-lg" />
          ))}
        </div>
      )}

      {/* Engagement metrics */}
      <div className="flex justify-between items-center mt-4 text-gray-500">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 9l5 5-5 5M3 5h18M3 19h18"></path>
            </svg>
            <span>{post.retweetsCount}</span>
          </span>
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11c0-1.3-1-2.3-2.3-2.3h-7.4C6 8.7 5 9.7 5 11v2c0 1.3 1 2.3 2.3 2.3h7.4C17 13.3 19 12.3 19 11z"></path>
            </svg>
            <span>{post.likesCount}</span>
          </span>
          <span className="flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7l9 9 9-9"></path>
            </svg>
            <span>{post.commentsCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostView;
