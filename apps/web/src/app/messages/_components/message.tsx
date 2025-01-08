/* eslint-disable @next/next/no-img-element */
'use client';

import { caltimeAgo } from '@/lib/timeAgo';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaRegFilePdf } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

interface FileInfo {
  name: string;
  type: string;
  size: number;
}

interface MessageProps {
  text: string;
  time: string;
  picture: string;
  file?: FileInfo | null;
}

const MessageCard = ({ text, time, file, picture }: MessageProps) => {
  const isImage = file && file.type.startsWith('image/');
  const isPDF = file && file.type === 'application/pdf';

  return (
    <div className="flex flex-col items-start">
        <div className="text-xs text-gray-500 mb-1">{caltimeAgo(time as string)}</div>
      <div className="flex gap-x-2">
        <div className="h-8 w-8 rounded-full">
          {picture ? (
            <img
              src={picture}
              alt="User picture"
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                e.currentTarget.src = '/icons/android-chrome-192x192.png';
              }}
                referrerPolicy='no-referrer'
            />
          ) : (
            <img
              src="/icons/android-chrome-192x192.png"
              alt="Default avatar"
              className="w-full h-full object-cover rounded-full"
            />
          )}
        </div>
        <div className="flex flex-col">
            {file && (
                <div className="mt-1 max-w-[450px]">
                    {isImage && (
                        <div className="relative max-h-[300px] max-w-[450px] mr-2">
                             <Image
                            src='/pirate-ship-background.jpg'
                                alt={file.name}
                                width={512}
                                height={320}
                                className="object-cover rounded-lg max-h-[300px] max-w-[450px]"
                            />
                        </div>
                    )}
                    {isPDF && (
                        <div
                            className="flex items-center gap-x-2 mt-1 ml-1 bg-gray-200 p-4 rounded-lg"
                            aria-label="pdf-file"
                        >
                            <FaRegFilePdf className="w-5 h-5" />
                            <Link
                                href={URL.createObjectURL(new Blob([file.name]))}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline mr-2"
                                aria-label={`link-to-pdf-${file.name}`}
                            >
                                {file.name} ({(file.size / 1024).toFixed(2)} KB)
                            </Link>
                        </div>
                    )}
                    {!isImage && !isPDF && (
                        <div
                            className="flex items-center gap-x-2 mt-1 bg-gray-200 p-4 rounded-lg"
                             aria-label="file"
                        >
                            <p className="ml-2">
                                {file.name} ({(file.size / 1024).toFixed(2)} KB)
                            </p>
                        </div>
                    )}
                </div>
            )}
          {text && (
            <div className="bg-gray-200 rounded-lg p-3 mt-1 text-sm text-gray-800 max-w-[400px]">
              {text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;