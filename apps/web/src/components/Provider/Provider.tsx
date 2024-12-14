'use client'

import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';
import SidebarLeft from '../SidebarLeft';
import SidebarRight from '../SidebarRight';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/context/Notification.Store';

interface LayoutProviderProps {
  children: ReactNode;
}

const LayoutProvider: React.FC<LayoutProviderProps> = ({ children }) => {
  const pathname = usePathname();
  const normalizedPathname = pathname.replace(/\/$/, ''); // Remove trailing slash
  const noSidebarPaths = ['/sign-in', '/sign-up', '/messages/*', '/'];
  
  const isNoSidebarPage = noSidebarPaths.some((path) => {
    if (path.endsWith('/*')) {
      return normalizedPathname.startsWith(path.slice(0, -2)); // Match paths like `/messages/*`
    }
    return normalizedPathname === path; 
  });

  return (
    <ReduxProvider store={store}>
      {!isNoSidebarPage ? (
        <div className="flex h-screen justify-center bg-gray-50">
          <div className="flex h-full w-full max-w-7xl mx-auto">
            <SidebarLeft />
            <main className="flex-1 bg-white overflow-y-auto">{children}</main>
            <SidebarRight />
          </div>
        </div>
      ) : (
        <div className="flex h-screen w-full">{children}</div>
      )}
    </ReduxProvider>
  );
};

export default LayoutProvider;
