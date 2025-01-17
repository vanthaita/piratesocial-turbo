'use client';

import React, { useState } from "react";
import { Home, Search, Bell, Mail, User } from "lucide-react";
import { AiOutlinePlus } from "react-icons/ai";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import NewPostModal from "./NewPostModal";
import { useSelector } from "react-redux";
import { RootState } from "@/context/store/Notification.Store";
import Image from "next/image";

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  notificationCount?: number; 
}

const SidebarLeft: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("Home");
  const { isAuthenticated, profile } = useAuth();
  const notificationCount = useSelector(
    (state: RootState) => state.notifications.count
  );
  const menuItems: MenuItem[] = [
    { label: "Home", icon: <Home /> ,href: '/'},
    { label: "Search", icon: <Search /> ,href: '/search'},
    { label: "Notifications", icon: <Bell />,href: '/notifications' ,notificationCount: notificationCount || 0},
    { label: "Messages", icon: <Mail />, href: '/messages' },
    { label: "Profile", icon: <User /> ,href: `/profile/1`},
  ];
  return (
    <>
      {isAuthenticated ? (
        <aside className="w-[20%] h-full flex flex-col items-center py-4 space-y-6 border-r border-gray-300">
          <div className="flex flex-col items-center space-y-2 mb-4">
            <div className="rounded-full w-16 h-16 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">
                <Image 
                  src={profile?.picture || ''}
                  alt={profile?.name || 'avatar'}
                  height={200}
                  width={200}
                  className="object-fit rounded-full"
                />
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-gray-800">
              {/* Pirates Social */}
              @{profile?.name}
            </h1>
          </div>
          <nav className="flex flex-col w-full px-4 space-y-2">
          {menuItems.map((item) => (
            <Link href={item.href as string} key={item.label} 
              onClick={() => setActiveItem(item.label)}
            >
              <div
                className={`flex items-center space-x-4 py-3 px-4 rounded-lg transition-all cursor-pointer ${
                  activeItem === item.label
                    ? "bg-gray-200 border-gray-800 shadow-md"
                    : "border-transparent hover:bg-gray-100 hover:shadow-lg"
                }`}
                role="button"
                tabIndex={0}
              >
                 <div className="relative">
                  <div className="text-gray-800">{item.icon}</div>
                  {(item.notificationCount ?? 0) > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                      {item.notificationCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-lg font-medium ${
                    activeItem === item.label ? "text-gray-800" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </span>
               
              </div>
            </Link>
          ))}

            <NewPostModal />
          </nav>
        </aside>
      ) : (
        <aside className="w-[20%] h-full flex flex-col items-center py-4 space-y-6 border-r border-gray-300 bg-gray-50">
          <div className="flex flex-col items-center space-y-2 mb-4">
            <div className="rounded-full border-2 border-gray-800 w-16 h-16 flex items-center justify-center bg-gray-100">
              <span className="text-3xl font-bold text-gray-800">@</span>
            </div>
            <h1 className="text-2xl font-bold tracking-wide text-gray-800">
              Pirate Social
            </h1>
          </div>
          <nav className="flex flex-col w-full px-4 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Link href="/sign-in">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-900 hover:shadow-lg hover:-translate-y-1 transform transition duration-300 ease-in-out">
                  <span className="font-semibold text-lg">Sign In</span>
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 hover:shadow-lg hover:-translate-y-1 transform transition duration-300 ease-in-out">
                  <span className="font-semibold text-lg">Sign Up</span>
                </button>
              </Link>
            </div>
            <p className="text-center text-gray-500 text-sm">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </nav>
        </aside>
      )}
    </>
  );
};

export default SidebarLeft;
