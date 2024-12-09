/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import FeedPost from './FeedPost';
import axiosInstance from '@/helper/axiosIntance';
interface User {
  id: number;
  name: string;
  providerId: string;
  picture: string;
}

interface PostData {
  id: number;
  userId: number;
  content: string;
  imagesUrl: string[];
  createdAt: string;
  user: User;
  likes: any[];
  comments: any[];
  commentsCount: number;
  likesCount: number;
  retweetsCount: number;
}
const CustomTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('discover');
  const [posts, setPosts] = useState<PostData[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadPosts = async (skip: number, take: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get('feed-posts/all', {
        params: { skip, take },
      });
      const data = response.data;
      setPosts((prevPosts) => [...prevPosts, ...data]);
      console.log(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPosts(page * 20, 20);
  }, [page]);
  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = document.getElementById('scroll-area');
      if (scrollArea) {
        const isBottom = scrollArea.scrollHeight - scrollArea.scrollTop === scrollArea.clientHeight;
        if (isBottom && !loading) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    const scrollArea = document.getElementById('scroll-area');
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loading]);

  return (
    <div className="mx-auto h-full w-full">
      <div className="flex sticky top-0 z-10 bg-white border-gray-200 shadow-md">
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === 'discover' ? 'border-b-2 border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'
          } focus:outline-none`}
          onClick={() => setActiveTab('discover')}
        >
          Discover
        </button>
        <button
          className={`px-4 py-2 text-lg font-semibold ${
            activeTab === 'following' ? 'border-b-2 border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'
          } focus:outline-none`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
      </div>

      {activeTab === 'discover' && (
        <div>
          <ScrollArea id="scroll-area" className="h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            <div>
              {posts.map((post, index) => (
                <FeedPost key={index} {...post} />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {activeTab === 'following' && (
        <div>
          <ScrollArea id="scroll-area" className="h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            <div>
              {posts.map((post, index) => (
                <FeedPost key={index} {...post} />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default CustomTabs;
