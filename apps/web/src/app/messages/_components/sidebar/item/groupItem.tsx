import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface GroupItemProps {
  group: {
    name: string;
    members: number;
    lastMessage: string;
    time: string;
    imgSrcs: string[];
    unread: number
  };
  index: number;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, index }) => (
    <Link href={`/messages/${index}`} key={index}>
        <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
        <div className="relative">
        <div className="gap-x-1 grid grid-cols-2 max-w-10 max-h-10">
            {group.imgSrcs.slice(0, 3).map((src, imgIndex) => (
            <Image
                key={imgIndex}
                height={24}
                width={24}
                src={src}
                alt={`Member ${imgIndex}`}
                className="w-[18px] h-[18px] rounded-full object-cover"
            />
            ))}
            {group.members > 3 && (
            <span className="w-[18px] h-[18px] flex items-center justify-center text-xs bg-gray-200 rounded-full">
                +{group.members - 4}
            </span>
            )}
        </div>
          <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center">
            {group.unread > 0 && (
                <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-green-500 rounded-full">
                {group.unread}
                </span>
            )}            
          </div>
        </div>
        <div className="flex-grow">
            <div className="flex justify-between items-center">
            <h4 className="font-semibold">{group.name}</h4>
            <span className="text-xs text-gray-500">{group.time}</span>
            </div>
            <p className="text-sm text-gray-600">{group.lastMessage}</p>
        </div>
        </li>
  </Link>
);

export default GroupItem;
