'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToggle } from '@/context/control';
import MessageCard from '@/app/messages/_components/message';
import {
  Paperclip,
  Smile,
  XIcon,
  ArrowLeft,
  EllipsisVertical,
    Loader2,
    AlertTriangle
} from 'lucide-react';
import { TbSend2 } from 'react-icons/tb';
import EmojiPicker from 'emoji-picker-react';
import { BsFiletypeSvg } from 'react-icons/bs';
import { FaRegFilePdf } from 'react-icons/fa6';
import { CiFileOn } from 'react-icons/ci';
import { Message, Profile } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useSearchParams } from 'next/navigation';
import axiosInstance from '@/helper/axiosIntance';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/context/store/LastMessage.store';
import { setLastMessage } from '@/context/slices/lastMessage.slice';
const MessagePage = () => {
  const { toggleChildren } = useToggle();
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPaperclipUpload, setShowPaperclipUpload] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const [showFileInMessage, setShowFileInMessage] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const roomInPathName = usePathname();
  const roomId = roomInPathName.split('/')[2];
  const { profile } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const imgSrc = searchParams.get('imgSrc');
  useEffect(() => {
      const fetchMessages = async () => {
          setLoading(true);
          setError(null);
          try {
              const response = await axiosInstance.get(`/chat/${roomId}`)
              const data = await response.data;
              console.log("Data: ", data);
              setMessages(data);
          } catch (error: any) {
              console.error('Error fetching messages:', error);
              setError("Failed to load messages. Please try again")
          } finally {
              setLoading(false);
          }
      };
      fetchMessages();
  }, [roomId]);

  useEffect(() => {
    const connectToSocket = (userProfile: Profile) => {
      if (userProfile) {
        if (!socketRef.current || socketRef.current.disconnected) {
          const newSocket = io('http://localhost:3001', {
            auth: {
              profile: userProfile,
            },
            reconnection: true,
            reconnectionAttempts: 5,
          });

          socketRef.current = newSocket;

          newSocket.on('connect', () => {
            console.log('Connected to WebSocket server');
            newSocket.emit('joinRoom', { roomId });
          });

          newSocket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
          });

          newSocket.on('receiveMessage', (message: Message) => {
            console.log('Received: ', message);
            if (audioRef.current) {
              audioRef.current
                .play()
                .catch((error) =>
                  console.error('Error playing audio:', error)
                );
            }
            setMessages((prevMessages) => [...prevMessages, message]);
            dispatch(
              setLastMessage({
                lastMessage: message.message,
                timestamp: message.createdAt,
              })
            );
          });

          newSocket.on('joinedRoom', (roomId: string) => {
            console.log(`Joined room ${roomId}`);
          });

          newSocket.on('leftRoom', (roomId: string) => {
            console.log(`Left room ${roomId}`);
          });
        }
      }
    };

    if (profile) {
      connectToSocket(profile as Profile);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [profile, roomId, dispatch]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim() !== '' || selectedFile) {
      const messageData = {
        message: inputMessage.trim(),
        file: selectedFile
          ? {
              name: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size,
            }
          : null,
        roomId,
      };

      if (socketRef.current) {
        socketRef.current.emit('sendMessage', messageData);
      }
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }

      setInputMessage('');
      setSelectedFile(null);
      setShowFileInMessage(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      handleUploadFile();
    }
  };

  const handleDeleteFileUpload = () => {
    setSelectedFile(null);
    setShowFileInMessage(false);
  };

  const handleUploadFile = () => {
    setShowFileInMessage(true);
    setShowPaperclipUpload(false);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'application/pdf':
        return <FaRegFilePdf className="text-red-500 w-10 h-14" />;
      case 'image/png':
      case 'image/jpeg':
      case 'image/gif':
      case 'image/svg+xml':
        return <BsFiletypeSvg className="text-blue-500 w-10 h-14" />;
      default:
        return <CiFileOn className="text-gray-500 w-10 h-14" />;
    }
  };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">
            <Loader2 className="animate-spin text-gray-500 mr-2" /> Loading...
        </div>
    }
      if (error) {
          return (
              <div className="flex items-center justify-center h-screen text-red-500">
                  <AlertTriangle className="mr-2" />
                  {error}
              </div>
          )
      }


  return (
    <div className="mx-auto h-screen flex flex-col">
      <audio ref={audioRef} src="/audio/message-sent.mp3" preload="auto" />
      <div className="py-2 px-6 border-b-2 border-gray-300">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center">
            <div className="md:hidden mr-4">
              <ArrowLeft
                onClick={toggleChildren}
                className="w-6 h-6 cursor-pointer text-gray-700"
              />
            </div>
            <Image
              width={200}
              height={200}
              src={imgSrc || ''}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
                referrerPolicy='no-referrer'
            />
            <div className="ml-4">
              <p className="text-lg font-bold">{name}</p>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div>
            <EllipsisVertical className="cursor-pointer w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-100 sidebar">
        {messages.map((message) => (
          <div key={message.id}>
            <MessageCard
              key={message.createdAt}
              text={message.message}
              time={message.createdAt}
              file={message.file}
                picture={message.sender.picture || ''}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-2 rounded-b-lg shadow-md">
        {showFileInMessage && selectedFile && (
          <div className="flex gap-x-4 justify-between items-center w-full mr-2">
            <div className="flex gap-x-4 justify-center items-center">
              {getFileIcon(selectedFile.type)}
              {selectedFile?.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </div>
            <XIcon className="cursor-pointer" onClick={handleDeleteFileUpload} />
          </div>
        )}

        <div className="flex items-center justify-between relative">
          <button
            className="text-gray-500 mr-2"
            onClick={() => setShowPaperclipUpload(!showPaperclipUpload)}
          >
            <Paperclip className="w-[20px] h-[20px] text-gray-700 cursor-pointer mt-1 ml-2" />
          </button>
          <div className="w-full">
            <input
              type="text"
              ref={inputRef}
                className="w-full px-4 py-2 focus:outline-none border rounded-lg border-gray-200"
              name="message"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          </div>

          <div className="flex justify-center items-center">
            <button className="text-gray-700 mr-2" onClick={handleSendMessage}>
              <TbSend2 className="w-6 h-6" />
            </button>
            <button
              className="text-gray-500 ml-2"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile />
            </button>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-16 right-4 z-10">
              <EmojiPicker
                onEmojiClick={(emojiObject) => {
                  setInputMessage((prevInput) => prevInput + emojiObject.emoji);
                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}
        </div>
        {showPaperclipUpload && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative flex items-center justify-center md:w-[450px] md:h-64 bg-white rounded-lg shadow-md">
              <button
                className="absolute top-4 right-4 text-gray-500"
                onClick={() => setShowPaperclipUpload(false)}
              >
                <XIcon />
              </button>
              <label
                className="flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                aria-label="upload-file"
              >
                {!selectedFile && (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="md:text-xs text-[10px] text-gray-500 dark:text-gray-400 px-1">
                      PDF (MAX. 4MB), SVG, PNG, JPG, or GIF (MAX. 800x400px)
                    </p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;