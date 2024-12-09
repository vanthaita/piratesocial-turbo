'use client';
import { useState, useEffect } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import FeedPost from './FeedPost';

const CustomTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('discover');
  const [posts, setPosts] = useState([
    {
      username: "Weeder",
      handle: "@weeder.bsky.social",
      imageUrl: "https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:4youk6koejgwe5m4lennnn4g/bafkreie7waea3t4ertvur5gosqjuog7slag32mux55t75rba6t6xe3t5lu@jpeg",
      time: "8h",
      content: "Doing some research into folding proteins (making an omelette)",
      comments: 67,
      shares: 167,
      likes: 2300,
    },
    {
      username: "Meme Hayes",
      handle: "@meme-hayes.bsky.social",
      imageUrl: "https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:fpgl4bkr6w45tyzynlnhog6r/bafkreieoa7hdcd6gavnz7ojyl7hhk22cyd6gvehvhipqrypex2644ke7z4@jpeg",
      time: "9h",
      content: "The older I get, the more I realize why Tupac hated everybody.",
      comments: 71,
      shares: 310,
      likes: 3600,
    },
  ]);

  const loadMorePosts = () => {
    const newPosts = [
      {
        username: "New User 1",
        handle: "@newuser1.bsky.social",
        imageUrl: "https://example.com/image1.jpg",
        time: "2h",
        content: "Another post added!",
        comments: 5,
        shares: 20,
        likes: 150,
      },
      {
        username: "New User 2",
        handle: "@newuser2.bsky.social",
        imageUrl: "https://example.com/image2.jpg",
        time: "3h",
        content: "Yet another post!",
        comments: 8,
        shares: 30,
        likes: 200,
      },
    ];
    setPosts((prevPosts) => [...prevPosts, ...newPosts]);
  };
  

  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = document.getElementById('scroll-area');
      if (scrollArea) {
        const isBottom = scrollArea.scrollHeight - scrollArea.scrollTop === scrollArea.clientHeight;
        if (isBottom) {
          loadMorePosts();
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
  }, []);

  return (
    <div className="mx-auto h-auto">
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
