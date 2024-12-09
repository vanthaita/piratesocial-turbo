'use client'
import React, { useState } from "react";
import { Home, Search, Bell, Mail, User } from "lucide-react";

const SidebarLeft = () => {
  const [activeItem, setActiveItem] = useState("Home");

  const menuItems = [
    { label: "Home", icon: <Home /> },
    { label: "Search", icon: <Search /> },
    { label: "Notifications", icon: <Bell /> },
    { label: "Messages", icon: <Mail /> , herf: '/messages'},
    { label: "Profile", icon: <User /> },
  ];

  return (
    <aside className="w-[20%] h-full flex flex-col items-center py-4 space-y-6 border-r border-gray-300">
      <div className="flex flex-col items-center space-y-2">
        <div className="rounded-full border-2 border-gray-800 w-16 h-16 flex items-center justify-center shadow-lg">
          <span className="text-3xl font-bold text-gray-800">@</span>
        </div>
        <h1 className="text-2xl font-bold tracking-wide text-gray-800">
          Pirate Social
        </h1>
      </div>
      <nav className="flex flex-col w-full px-4 space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.label}
            onClick={() => setActiveItem(item.label)}
            className={`flex items-center space-x-4 py-3 px-4 rounded-lg transition-all cursor-pointer border ${
              activeItem === item.label
                ? "border-gray-800 shadow-md"
                : "border-transparent hover:shadow-lg"
            }`}
          >
            <div className="text-gray-800">{item.icon}</div>
            <span
              className={`text-lg font-medium ${
                activeItem === item.label ? "text-gray-800" : "text-gray-600"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>
      {/* <div className="mt-auto text-center text-sm text-gray-500">
        <p>© 2024 Pirate Social</p>
        <p>All rights reserved.</p>
      </div> */}
    </aside>
  );
};

export default SidebarLeft;
