'use client';
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ToggleContextProps {
  showChildren: boolean;
  toggleChildren: () => void;
}

const ToggleContext = createContext<ToggleContextProps | undefined>(undefined);

export const useToggle = (): ToggleContextProps => {
  const context = useContext(ToggleContext);
  if (!context) {
    throw new Error("useToggle must be used within a ToggleProvider");
  }
  return context;
};

interface ToggleProviderProps {
  children: ReactNode;
}

export const ToggleProvider: React.FC<ToggleProviderProps> = ({ children }) => {

    const [showChildren, setShowChildren] = useState<boolean>(true);

    const toggleChildren = () => setShowChildren((prev) => !prev);

    return (
        <ToggleContext.Provider value={{ showChildren, toggleChildren }}>
          {children}
          
        </ToggleContext.Provider>
    );
};
