/* eslint-disable @next/next/no-img-element */
'use client'
import { caltimeAgo } from '@/lib/timeAgo';
import { UserProfile } from '@/types';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface Notification {
  messageToSave: {
    postId: number;
    message: string;
  };
  userId: number;
  timestamp: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([{"messageToSave":{"postId":20,"message":"User 1 created a new post!"},"userId":1,"timestamp":"2024-12-13T12:35:05.334Z"}]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      auth: { profile: { id: 1 } },
    });

    socket.on('connect', () => {
      console.log('WebSocket connected!');
      socket.emit('subscribeNotifications');
    });

    socket.on('receiveNotification', (notification: Notification) => {
      console.log('Received notification:', notification);
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen">
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="flex flex-col space-y-2 border-b border-gray-300 p-4"
          >
            <div className="flex justify-between items-center">
              {/* <h2 className="text-lg font-semibold">Notification for Post {notification.messageToSave.postId}</h2> */}
              <span className="text-sm text-gray-500">
                {caltimeAgo(notification.timestamp)}
              </span>
            </div>
            <p className="text-gray-800">{notification.messageToSave.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
