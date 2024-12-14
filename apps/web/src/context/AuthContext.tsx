'use client';
import axiosInstance from "@/helper/axiosIntance";
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import Cookies from "js-cookie"; 

interface Profile {
  id: string,
  name: string,
  email: string,
  givenName: string,
  familyName: string,
  picture: string,
  lastActiveAt: Date,
  providerId: string,
  status: string,
  createdAt: Date,
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
  accesstoken: string | null;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, accesstoken }) => {
  const [accessToken, setAccessToken] = useState<string | null>(accesstoken);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!accessToken);

  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      console.log("Data profile: ",response.data)
      const data = response.data as Profile;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };
  useEffect(() => {
    if (accessToken) {
      fetchProfile();
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setProfile(null);
    }
    console.log("Access Token: ",accessToken);
    
  }, [accessToken]);

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
