/* eslint-disable @next/next/no-img-element */
'use client'
import { useAuth } from '@/context/AuthContext';
import { AppDispatch, RootState } from '@/context/Notification.Store';
import { incrementNotification, setNotificationCount } from '@/context/slices/notificationSlice';
import axiosInstance from '@/helper/axiosIntance';
import { caltimeAgo } from '@/lib/timeAgo';
import { UserProfile } from '@/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

interface Notification {
  messageToSave: {
    postId: number;
    message: string;
  };
  userId: number;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const {profile} = useAuth();
  const router = useRouter();
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/notifications');
        const notificationsFromAPI = response.data.notifications;
        const notificationCount = response.data.count;
        const formattedNotifications = notificationsFromAPI.map((notification: any) => {
          const { message, userId, createdAt } = notification;
          let parsedMessage;
          try {
            parsedMessage = JSON.parse(message);
          } catch (err) {
            console.error('Error parsing message:', err);
            parsedMessage = { postId: null, message: 'Invalid message format' };
          }
          return {
            userId,
            messageToSave: {
              postId: parsedMessage.postId,
              message: parsedMessage.message,
            },
            createdAt,
          };
        });
        setNotifications(formattedNotifications);
        dispatch(setNotificationCount(notificationCount));
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
  
    fetchNotifications();
  }, [dispatch]);
  useEffect(() => {
    const socket = io('http://localhost:3001', {
      auth: { profile: { id: profile?.id } },
    });

    socket.on('connect', () => {
      console.log('WebSocket connected!');
      socket.emit('subscribeNotifications');
    });

    socket.on('receiveNotification', (notification: Notification) => {
      console.log('Received notification:', notification);
      setNotifications((prev) => [notification, ...prev]);
      dispatch(incrementNotification());
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, profile?.id]);

  return (
    <div className="min-h-screen">
      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <div
            key={index}
            className="flex flex-col space-y-2 border-b border-gray-300 p-4 cursor-pointer"
            onClick={() => {
              router.push(`profile/${notification.userId}/post/${notification.messageToSave.postId}`)
            }}
          >
            <div className="flex justify-between items-center">
              {/* <h2 className="text-lg font-semibold">Notification for Post {notification.messageToSave.postId}</h2> */}
              <span className="text-sm text-gray-500">
                {caltimeAgo(notification.createdAt)}
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
