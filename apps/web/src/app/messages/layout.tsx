'use client';
import { useToggle } from "@/context/control";
import useIsMobile from "@/hook/useIsMobile";
import Sidebar from "./_components/sidebar/sidebar";
import { Suspense } from "react";
import Loading from "../loading";
import { store } from "@/context/store/LastMessage.store";
import { Provider as ReduxProvider } from 'react-redux';
export default function MessageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { showChildren, toggleChildren } = useToggle();
  
  const isMobile = useIsMobile();
  return (
    <ReduxProvider store={store}>
      <div className="flex h-screen w-full">
        <Sidebar className={`md:block ${isMobile && showChildren ? "hidden md:block" : "block"}`} />
        <main className={`relative flex-grow ${isMobile && showChildren ? "w-full" : "hidden md:block"}`}>
          <Suspense fallback={<Loading />}>
            {children}
          </Suspense>
        </main>
      </div>
    </ReduxProvider>
    
  );
}
