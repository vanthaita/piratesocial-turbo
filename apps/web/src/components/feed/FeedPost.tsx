/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import {
  Image as ImageIcon,
  Video,
  Smile,
  X,
  MessageCircle,
  Repeat,
  Heart,
  MoreHorizontal,
} from "lucide-react";

type FeedPostProps = {
  username: string;
  handle: string;
  time: string;
  content: string;
  imageUrl?: string;
};

const FeedPost: React.FC<FeedPostProps> = ({
  username,
  handle,
  time,
  content,
  imageUrl,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState("");

  const handleCommentClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setComment("");
  };

  return (
    <>
      <div className="border border-gray-300 transition-all duration-300 p-4 bg-white">
        <div className="flex items-start space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src="https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:4youk6koejgwe5m4lennnn4g/bafkreie7waea3t4ertvur5gosqjuog7slag32mux55t75rba6t6xe3t5lu@jpeg"
              alt={`${username} profile`}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold text-gray-900">{username}</p>
                <p className="text-sm text-gray-600">
                  {handle} · {time}
                </p>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreHorizontal size={20} />
              </button>
            </div>
            <div className="mt-2 text-gray-800">
              <p className="text-base">{content}</p>
            </div>
            {imageUrl && (
              <div className="mt-4 flex justify-center">
                <img
                  src={imageUrl}
                  alt="Post content"
                  className="rounded-lg object-contain w-full h-auto"
                  style={{ maxWidth: "95%", maxHeight: "90%" }}
                />
              </div>
            )}


          </div>
        </div>

        <div className="mt-4 flex justify-around pt-3 text-gray-500 text-sm">
          <button className="flex items-center space-x-1 hover:text-red-500 transition-all">
            <Heart size={18} />
            <span>Like</span>
          </button>
          <button
            className="flex items-center space-x-1 hover:text-blue-500 transition-all"
            onClick={handleCommentClick}
          >
            <MessageCircle size={18} />
            <span>Comment</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-green-500 transition-all">
            <Repeat size={18} />
            <span>Retweet</span>
          </button>
          
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-11/12 max-w-lg shadow-xl">
            <div className="flex justify-between items-center p-5">
              <p className="font-bold text-gray-800 text-lg">
                Reply to {username}
              </p>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src="https://via.placeholder.com/40"
                    alt={`${username} profile`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{username}</p>
                  <p className="text-sm text-gray-600">{content}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your reply..."
                className="w-full p-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                rows={3}
              ></textarea>
              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-4 text-gray-500">
                  <button className="hover:text-black transition-all">
                    <ImageIcon size={20} />
                  </button>
                  <button className="hover:text-black transition-all">
                    <Video size={20} />
                  </button>
                  <button className="hover:text-black transition-all">
                    <Smile size={20} />
                  </button>
                </div>
                <span className="text-sm text-gray-400">
                  {300 - comment.length} / 300
                </span>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-blue-500 text-white px-5 py-2 rounded-full shadow hover:bg-blue-600 transition-all duration-200"
                  onClick={closeModal}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedPost;
