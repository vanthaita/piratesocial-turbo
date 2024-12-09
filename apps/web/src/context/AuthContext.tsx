'use client'
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Profile {
  id: number;
  name: string;
  email: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  providerId?: string;
  createdAt: Date;
}
interface AuthContextProps {
  accessToken: string | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setAccessToken: (token: string | null) => void;
  setProfile: (profile: Profile | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        profile,
        isAuthenticated,
        setIsAuthenticated,
        setAccessToken,
        setProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
