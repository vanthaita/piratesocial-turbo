/* eslint-disable @next/next/no-img-element */
'use client';

import { useAuth } from '@/context/AuthContext';
import { AppDispatch, RootState } from '@/context/store/Notification.Store';
import {
  incrementNotification,
  setNotificationCount,
} from '@/context/slices/notificationSlice';
import axiosInstance from '@/helper/axiosIntance';
import { caltimeAgo } from '@/lib/timeAgo';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Loader2, BellOff, AlertTriangle } from 'lucide-react'; // Import icons

interface Notification {
  id: number;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const notificationCount = useSelector(
    (state: RootState) => state.notifications.count
  );
  const { profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosInstance.get('/notifications');
        const notificationsFromAPI = response.data.notifications;
        const notificationCount = response.data.count;
        const formattedNotifications = notificationsFromAPI.map(
          (notification: any) => {
            const { message, userId, createdAt, id } = notification;
            let parsedMessage;
            try {
              parsedMessage = JSON.parse(message);
            } catch (err) {
              console.error('Error parsing message:', err);
              parsedMessage = {
                postId: null,
                message: 'Invalid message format',
              };
            }
            return {
              id,
              userId,
              messageToSave: {
                postId: parsedMessage.postId,
                message: parsedMessage.message,
              },
              createdAt,
            };
          }
        );
        setNotifications(formattedNotifications);
        dispatch(setNotificationCount(notificationCount));
      } catch (err: any) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [dispatch]);

  useEffect(() => {
    const markNotificationsAsSeen = async () => {
      try {
        if (notificationCount > 0 && notifications.length > 0) {
          const uniqueNotificationIds = Array.from(
            new Set(notifications.map((n) => n.id))
          );
          if (uniqueNotificationIds.length > 0) {
            await axiosInstance.post('/notifications/mark-as-seen', {
              notificationIds: uniqueNotificationIds,
            });
            dispatch(setNotificationCount(0));
          }
        }
      } catch (error) {
        console.error('Error marking notifications as seen:', error);
      }
    };

    markNotificationsAsSeen();
  }, [dispatch, notificationCount, notifications]);

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

        // Check if browser supports notifications
        if ("Notification" in window) {
        // Check if notification permission is granted
        if (Notification.permission === "granted") {
            // If granted, display notification
          displayNotification(notification);
        } else if (Notification.permission !== 'denied') {
            // If not denied, request permission
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              displayNotification(notification)
            }
          });
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, profile?.id]);

    const displayNotification = (notification:Notification) => {
        new Notification('New notification!', {
            body: notification.messageToSave.message,
            icon: '/logo.png'
        })
    }

  return (
    <div className="min-h-screen py-6">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Notifications
        </h1>
        {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="animate-spin text-gray-500 mr-2" />
              <p className="text-gray-500">Loading notifications...</p>
            </div>
          )}
           {error && (
              <div className="flex items-center justify-center py-4 text-red-500">
                <AlertTriangle className="mr-2" />
                {error}
              </div>
            )}
        {!loading && !error && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <BellOff className="h-12 w-12 text-gray-400" />
            <p className="text-gray-500 text-center">
              You have no new notifications.
            </p>
          </div>
        )}
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className="bg-white border rounded-md border-gray-200 shadow-sm p-4 cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => {
                router.push(
                  `profile/${notification.userId}/post/${notification.messageToSave.postId}`
                );
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  {caltimeAgo(notification.createdAt)}
                </span>
              </div>
              <p className="text-gray-800">{notification.messageToSave.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;