import React, { useState } from "react";
import { X, Image as ImageIcon, Video, Smile, Paperclip } from "lucide-react";
import axiosInstance from "@/helper/axiosIntance";

const NewPostModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const maxCharacters = 300;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleCreateNewPost = async () => {
    if (!content.trim()) {
      alert("Post content cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const responseData = await axiosInstance.post("feed-posts", {
        content,
      });
      console.log("New post created successfully:", responseData);
      setContent("");  
      closeModal();   
      window.location.reload(); 
    } catch (e) {
      console.error("Error creating new post:", e);
      alert("Failed to create a new post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="flex items-center justify-center w-full py-3 px-6 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-transform duration-300 ease-in-out transform hover:-translate-y-1"
      >
        <Paperclip size={20} className="mr-2" />
        New Post
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-11/12 max-w-lg shadow-xl">
            <div className="flex justify-between items-center p-5 border-b">
              <p className="font-bold text-gray-800 text-lg">Create New Post</p>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                rows={4}
                maxLength={maxCharacters}
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
                  {maxCharacters - content.length} / {maxCharacters}
                </span>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                className={`px-5 py-2 rounded-full shadow ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } transition-all duration-200`}
                onClick={handleCreateNewPost}
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-blue-500 border-solid rounded-full animate-spin" />
                  </div>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPostModal;
