import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ChannelItemProps {
  channel: {
    name: string;
    status: string;
    time: string;
    unread: number;
    imgSrc: string;
  };
  index: number;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ channel, index }) => (
    <Link href={`/channels/${index}`} key={index} >
        <li className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <div className="relative">
            <Image
              height={40}
              width={40}
              src={channel.imgSrc}
              alt={channel.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full flex items-center justify-center">
              {channel.unread > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-green-500 rounded-full">
                  {channel.unread}
                  </span>
              )}            
            </div>
          </div>
        <div className="flex-grow">
            <div className="flex justify-between items-center">
            <h4 className="font-semibold">{channel.name}</h4>
            <span className="text-xs text-gray-500">{channel.time}</span>
            </div>
            <p className="text-sm text-gray-600">{channel.status}</p>
        </div>
        </li>
  </Link>
);

export default ChannelItem;
