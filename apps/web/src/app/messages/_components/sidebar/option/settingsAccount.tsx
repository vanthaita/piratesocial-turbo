import { ArrowLeft, MessageCircle, Shield, Bell, Database, Smartphone, Globe, HelpCircle, LogOut } from 'lucide-react';
import React from 'react';

interface SettingsAccountProps {
  showAccountSettings: boolean;
  setShowAccountSettings: React.Dispatch<React.SetStateAction<boolean>>;
  isShowOptionProfile: boolean;
  setIShowOptionProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const AccountSettings: React.FC<SettingsAccountProps> = ({ showAccountSettings, setShowAccountSettings, setIShowOptionProfile }) => {
  if (!showAccountSettings) return null;

  return (
    <aside className="bg-white shadow-md overflow-y-auto fixed sidebar z-20 w-full h-full">
      <div className="flex justify-between px-6 py-4 items-center border-b bg-gray-100">
        <h2 className="text-lg font-semibold text-gray-700">Account Settings</h2>
        <ArrowLeft
          onClick={() => {
            setShowAccountSettings(false)
            setIShowOptionProfile(false)
          }}
          className="cursor-pointer w-6 h-6 text-gray-600 hover:text-gray-800 transition-all duration-300"
        />
      </div>

      <div className="px-6 py-4 border-b">
        <h3 className="text-gray-800 font-medium mb-2">Profile Information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Username</span>
            <span className="text-gray-800">Thai Ta</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email</span>
            <span className="text-gray-800">vanthai@email.com</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="px-6 py-4 flex items-center border-b cursor-pointer hover:bg-gray-100 transition">
          <MessageCircle className="w-5 h-5 text-gray-600 mr-3" />
          <span className="text-gray-800">Chat Settings</span>
        </div>

        <div className="px-6 py-4 flex items-center border-b cursor-pointer hover:bg-gray-100 transition">
          <Shield className="w-5 h-5 text-gray-600 mr-3" />
          <span className="text-gray-800">Privacy & Security</span>
        </div>

        <div className="px-6 py-4 flex items-center border-b cursor-pointer hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-600 mr-3" />
          <span className="text-gray-800">Notifications & Sounds</span>
        </div>

        <div className="px-6 py-4 flex items-center border-b cursor-pointer hover:bg-gray-100 transition">
          <Database className="w-5 h-5 text-gray-600 mr-3" />
          <span className="text-gray-800">Data & Storage</span>
        </div>

        <div className="px-6 py-4 flex items-center border-b cursor-pointer hover:bg-gray-100 transition">
          <Smartphone className="w-5 h-5 text-gray-600 mr-3" />
          <span className="text-gray-800">Devices</span>
        </div>
        <div className="px-6 py-4 flex items-center border-b cursor-pointer hover:bg-gray-100 transition">
          <Globe className="w-5 h-5 text-gray-600 mr-3" />
          <span className="text-gray-800">Language</span>
        </div>

        <div className="px-6 py-4 flex flex-col border-b">
          <h3 className="text-gray-800 font-medium mb-2">Help</h3>
          <div className="space-y-2">
            <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition">
              <HelpCircle className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-800">Ask a Question</span>
            </div>
            <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition">
              <HelpCircle className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-800">FAQ</span>
            </div>
            <div className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition">
              <HelpCircle className="w-5 h-5 text-gray-600 mr-3" />
              <span className="text-gray-800">Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AccountSettings;
