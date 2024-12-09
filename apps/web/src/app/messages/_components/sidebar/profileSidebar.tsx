'use client';
import { XIcon, Settings, Wallet, User, LogOut, Mail, UserPlus, ArrowLeft, Newspaper } from 'lucide-react';
import React, { useState } from 'react';
import MyProfile from './option/myProfile';
import WalletPage from './option/walletPage';
import SavedMessages from './option/savedMessage';
import InviteFriends from './option/inviteFriend';
import AccountSettings from './option/settingsAccount';
import { useRouter } from 'next/navigation';
interface ProfileSidebarProps {
  showProfile: boolean;
  setShowProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ showProfile, setShowProfile }) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showMyProfile, setShowMyProfile] = useState<boolean>(false);
  const [showSavedMessages, setShowSavedMessages] = useState<boolean>(false);
  const [showInviteFriends, setshowInviteFriends] = useState<boolean>(false);
  const [showAccountSettings, setShowAccountSettings] = useState<boolean>(false);
  const [showWallet, setShowWallet] = useState<boolean>(false);
  const [isShowOptionProfile, setIShowOptionProfile] = useState<boolean>(false);
  const router = useRouter();
  const renderSelectedOption = () => {
    switch (selectedOption) {
      case 'MyProfile':
        return <MyProfile showMyProfile={showMyProfile} setShowMyProfile={setShowMyProfile}  isShowOptionProfile={isShowOptionProfile} setIShowOptionProfile={setIShowOptionProfile}/>;
      case 'Wallet':
        return <WalletPage showWallet={showWallet} setShowWallet={setShowWallet} isShowOptionProfile={isShowOptionProfile} setIShowOptionProfile={setIShowOptionProfile}  />;
      case 'SavedMessages':
        return <SavedMessages showSavedMessages={showSavedMessages} setShowSavedMessages={setShowSavedMessages} isShowOptionProfile={isShowOptionProfile} setIShowOptionProfile={setIShowOptionProfile}/>;
      case 'InviteFriends':
        return <InviteFriends showInviteFriends={showInviteFriends} setShowInviteFriends={setshowInviteFriends} isShowOptionProfile={isShowOptionProfile} setIShowOptionProfile={setIShowOptionProfile} />;
      case 'AccountSettings':
        return <AccountSettings showAccountSettings={showAccountSettings} setShowAccountSettings={setShowAccountSettings} isShowOptionProfile={isShowOptionProfile} setIShowOptionProfile={setIShowOptionProfile}/>;
      case 'Feed': 
        return '';
      default:
        return null;
    }
  };

  return (
    <>
      <aside className={`bg-gradient-to-b from-gray-200 to-white shadow-lg overflow-y-auto z-20 w-full h-full`}>
        <div className="flex flex-col justify-between w-full h-[20%] bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <div className="flex justify-between w-full items-center">
            <div className="bg-black w-12 h-12 rounded-full"></div>
            <ArrowLeft
              onClick={() => {
                setShowProfile(false)
                setIShowOptionProfile(false);
              }}
              className="cursor-pointer w-8 h-8 rounded-full transition-all duration-300 text-white"
            />
          </div>
          <div className="flex justify-start items-start text-gray-300">
            <p>22521377@gmail.com</p>
          </div>
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            <SidebarOption
              label="My Profile"
              icon={<User className="w-5 h-5 mr-3" />}
              onClick={() => {
                setSelectedOption('MyProfile');
                setShowMyProfile(true);
                setIShowOptionProfile(true);
              }}
            />
             <SidebarOption
              label="New Feed"
              icon={<Newspaper className="w-5 h-5 mr-3" />}
              onClick={() => {
                setShowProfile(false)
                setIShowOptionProfile(false);
                router.push('/')
              }}
            />
            <SidebarOption
              label="Wallet"
              icon={<Wallet className="w-5 h-5 mr-3" />}
              onClick={() => {
                setSelectedOption('Wallet');
                setShowWallet(true);
                setIShowOptionProfile(true);

              }}
            />
            <SidebarOption
              label="Saved Messages"
              icon={<Mail className="w-5 h-5 mr-3" />}
              onClick={() => {
                setSelectedOption('SavedMessages');
                setShowSavedMessages(true);
                setIShowOptionProfile(true);
              }}
            />
            <SidebarOption
              label="Invite Friends"
              icon={<UserPlus className="w-5 h-5 mr-3" />}
              onClick={() => {
                setSelectedOption('InviteFriends');
                setshowInviteFriends(true);
                setIShowOptionProfile(true);
              }}
            />
            <SidebarOption
              label="Account Settings"
              icon={<Settings className="w-5 h-5 mr-3" />}
              onClick={() => {
                setSelectedOption('AccountSettings');
                setShowAccountSettings(true);
                setIShowOptionProfile(true);
              }}
            />
            <SidebarOption
              label="Log Out"
              icon={<LogOut className="w-5 h-5 mr-3" />}
              onClick={() => setSelectedOption('LogOut')}
            />
            
          </ul>
        </div>
      </aside>
      <div
        className={`transform ease-in-out duration-300 fixed top-0 bg-gray-200 left-0 h-full ${
          isShowOptionProfile ? 'translate-x-0 w-full' : '-translate-x-full w-0'
        }`}
      >
        {isShowOptionProfile && renderSelectedOption()}
      </div>
    </>
  );
};

interface SidebarOptionProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const SidebarOption: React.FC<SidebarOptionProps> = ({ label, icon, onClick }) => (
  <li
    className="cursor-pointer hover:bg-gray-100 p-3 rounded-lg flex items-center"
    onClick={onClick}
  >
    {icon} {label}
  </li>
);

export default ProfileSidebar;
