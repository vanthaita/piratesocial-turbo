'use client'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '@/helper/axiosIntance';
import { incrementNotification, setNotificationCount } from '@/context/slices/notificationSlice';
import { useAuth } from '@/context/AuthContext';
import { io } from 'socket.io-client';

const NotificationFetcher = () => {
  const dispatch = useDispatch();
  const {profile} = useAuth(); 
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosInstance.get('/notifications');
        const notificationCount = response.data.count;
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
      dispatch(incrementNotification());
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, profile?.id]);
  return null;
  
};

export default NotificationFetcher;
