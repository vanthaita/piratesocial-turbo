import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useToggle } from '@/context/control'; 

interface Room {
  id: number;
  name: string;
  type: "ONE_TO_ONE" | "GROUP"; // Adjust "GROUP" if there are other possible types
  createdAt: string; // ISO 8601 date string
}

interface ChatData {
  id: number;
  roomId: number;
  userId: number;
  name: string;
  status: "active" | "inactive" | "offline"; 
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
  const { toggleChildren } = useToggle();
  
  return (
    <Link href={`/messages/${contact.roomId}`} key={contact.id} onClick={toggleChildren}>
      <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <div className="relative">
          <Image
            height={40}
            width={40}
            src={contact.imgSrc}
            alt={contact.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          {contact.unread > 0 && (
            <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center">
              <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-green-500 rounded-full">
                {contact.unread}
              </span>
            </div>
          )}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">{contact.name}</h4>
            <span className="text-xs text-gray-500">{contact.time}</span>
          </div>
          <p className="text-sm text-gray-600">{contact.lastMessage}</p>
        </div>
      </li>
    </Link>
  );
};

export default ContactItem;
