'use client'
import React, { useState } from "react";
import { Search } from "lucide-react";

const SidebarRight = () => {
  const [searchValue, setSearchValue] = useState("");

  const trendingTopics = [
    { label: "Pirate Codes" },
    { label: "Market Trends" },
    { label: "Hot Topics" },
  ];

  return (
    <aside className="w-[25%] h-full p-4 flex flex-col space-y-8 border-l border-gray-300">
      {/* Search Section */}
      <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm transition-all hover:shadow-md focus-within:shadow-md">
        <input
          type="text"
          placeholder="Search topics..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1 text-sm text-gray-800 placeholder-gray-500 outline-none"
        />
        <button className="text-gray-600 hover:text-gray-800 transition-all">
          <Search size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Trending Topics Section */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 tracking-wide mb-4">
          Trending Topics
        </h2>
        <ul className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <li key={index}>
              <button className="flex w-full items-center justify-start text-left text-gray-700 hover:text-gray-900 hover:underline transition-all">
                <span className="text-base font-medium">{topic.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer Section */}
      <div className="mt-auto text-center text-sm text-gray-500">
        <p>Discover more topics on Pirate Social.</p>
        <p>© 2024 Pirate Social</p>
      </div>
    </aside>
  );
};

export default SidebarRight;
