'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const SidebarRight = () => {
  const [searchValue, setSearchValue] = useState('');

  const trendingTopics = [
    { label: 'Pirate Codes' },
    { label: 'Market Trends' },
    { label: 'Hot Topics' },
  ];

  return (
    <aside
      className="w-[25%] h-full p-4 flex flex-col space-y-6 border-l border-gray-200 bg-gray-50 transition-colors duration-300"
        aria-label='right-sidebar'
    >
      <div className="relative">
          <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition-all">
        <input
          type="text"
          placeholder="Search topics..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none"
           aria-label='search-topics'
        />
        <button className="text-gray-600 hover:text-blue-600 transition-all focus:outline-none" aria-label='search'>
          <Search size={18} strokeWidth={1.5} />
        </button>
          </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-800 tracking-wide mb-3">
          Trending Topics
        </h2>
        <ul className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <li key={index}>
              <button
                className={cn(
                  'flex items-center w-full gap-2 text-left text-gray-700 hover:text-blue-600 transition-colors duration-200 focus:outline-none',
                 )}
                aria-label={`topic-${topic.label}`}
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-sm font-medium">{topic.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto text-center text-xs text-gray-500">
        <p className="mb-1">Discover more topics on Pirate Social.</p>
        <p className="font-medium">© 2024 Pirate Social</p>
      </div>
    </aside>
  );
};

export default SidebarRight;