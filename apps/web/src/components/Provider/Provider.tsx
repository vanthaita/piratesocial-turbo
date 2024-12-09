'use client'
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';
import SidebarLeft from '../SidebarLeft';
import SidebarRight from '../SidebarRight';

interface ProviderProps {
    children: ReactNode;
}

const Provider: React.FC<ProviderProps> = ({ children }) => {
    const pathname = usePathname();
    const normalizedPathname = pathname.replace(/\/$/, '');
    const noSidebarPaths = ['/sign-in', '/sign-up', '/messages/*', '/']; 
    const isNoSidebarPage = noSidebarPaths.some(path => {
        if (path.endsWith('/*')) {
            return normalizedPathname.startsWith(path.slice(0, -2)); 
        }
        return normalizedPathname === path; 
    });
    return (
        <div>
            {!isNoSidebarPage ? (
                <div className="flex h-screen justify-center bg-gray-50">
                    <div className="flex h-full w-full max-w-7xl mx-auto">
                        <SidebarLeft />
                        <main className="flex-1 bg-white overflow-y-auto">
                            {children}
                        </main>
                        <SidebarRight />
                    </div>
                </div>
            ) : (
                <div className="flex h-screen w-full">
                    {children}
                </div> 
            )}
        </div>
    );
}

export default Provider;
