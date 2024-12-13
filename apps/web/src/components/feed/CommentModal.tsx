/* eslint-disable @next/next/no-img-element */
'use client'
import axiosInstance from "@/helper/axiosIntance";
import { ImageIcon, Smile, Video, X } from "lucide-react";
import { useState } from "react";
import {useRouter} from "next/navigation"
interface User {
  id: number;
  name: string;
  providerId: string;
  picture?: string;
}
interface Comment {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  user: User;
}

interface CommentModalProps {
    comments: Comment[];
    user: User;
    postId: number;
    content: string;
    onClose: () => void;
    setIsModalOpen: (open: boolean) => void;
  }
  
const CommentModal: React.FC<CommentModalProps> = ({
    comments,
    postId,
    user,
    content,
    onClose,
    setIsModalOpen,
  }) => {
    const [comment, setComment] = useState("");
    const router = useRouter();
    const handleCommentSubmit = async () => {
      try {
        if (comment.trim()) {
          await axiosInstance.post(`/feed-posts/${postId}/comment`, { content: comment });
          setComment("");
          router.refresh();
          setIsModalOpen(false);
        } else {
          alert("Comment cannot be empty.");
        }
      } catch (error) {
        console.error("Error commenting on post:", error);
        alert("Could not add comment.");
      }
    };
  
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-11/12 max-w-lg shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-gray-200">
              <p className="font-bold text-gray-800 text-lg">Reply to {user.name}</p>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                  <img
                    src={user.picture}
                    alt={`${user.name} profile`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{content}</p>
                </div>
              </div>
            </div>

            {/* <div className="px-4 py-3 border-gray-200">
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start space-x-2 p-2 border-t border-gray-300">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                      <img
                        src={comment.user?.picture}
                        alt={`${comment.user?.name} profile`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{comment.user?.name}</p>
                      <p className="text-sm text-gray-600">{comment?.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
            <div className="p-4 border-t border-gray-200">
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
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition-all"
                  onClick={handleCommentSubmit}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
    );
  };
export default CommentModal