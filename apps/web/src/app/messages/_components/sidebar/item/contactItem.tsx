'use client'
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToggle } from '@/context/control';
import { useSelector } from 'react-redux';
import { RootState } from '@/context/store/LastMessage.store';
import { caltimeAgo } from '@/lib/timeAgo';

interface Room {
  id: number;
  name: string;
  type: 'ONE_TO_ONE' | 'GROUP';
  createdAt: string;
}

interface ChatData {
  id: number;
  roomId: number;
  userId: number;
  name: string;
  status: 'active' | 'inactive' | 'offline';
  time: string;
  lastMessage: string;
  unread: number;
  imgSrc: string;
  room: Room;
}

interface ContactItemProps {
  contact: ChatData;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact }) => {
  const router = useRouter();
  const { toggleChildren } = useToggle();

  const lastMessage = useSelector(
    (state: RootState) => state.lastMessage?.lastMessage || contact.lastMessage
  );
  const lastMessageTimestamp = useSelector(
    (state: RootState) => state.lastMessage?.timestamp || contact.time
  );

  const handleNavigation = () => {
    toggleChildren();
    router.push(
      `/messages/${contact.roomId}?name=${encodeURIComponent(contact.name)}&imgSrc=${encodeURIComponent(contact.imgSrc)}`
    );
  };

  return (
    <li
      onClick={handleNavigation}
      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
    >
      <div className="relative">
        <Image
          height={40}
          width={40}
          src={contact.imgSrc}
          alt={contact.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        {contact.unread > 0 && (
          <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
            {contact.unread}
          </div>
        )}
      </div>

      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h4 className="font-semibold">{contact.name}</h4>
          <span className="text-xs text-gray-500">
            {caltimeAgo(lastMessageTimestamp)}
          </span>
        </div>
        <p className="text-sm text-gray-600">{lastMessage}</p>
      </div>
    </li>
  );
};

export default ContactItem;
