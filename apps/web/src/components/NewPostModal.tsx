'use client';
import React, { useState } from 'react';
import {
  X,
  Image as ImageIcon,
  Video,
  Smile,
  Paperclip,
  Loader2,
} from 'lucide-react';
import axiosInstance from '@/helper/axiosIntance';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';

const NewPostModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const maxCharacters = 250;
  const router = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setContent('');
    setImages([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  const handleCreateNewPost = async () => {
    if (!content.trim() && images.length === 0) {
      toast.error('Post content or at least one image is required.');
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('content', content);
      images.forEach((image) => formData.append('images', image));

      await axiosInstance.post('feed-posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
        toast.success('New post created successfully');
      setContent('');
      setImages([]);
      router.refresh();
      closeModal();
    } catch (e: any) {
      console.error('Error creating new post:', e);
        toast.error(e?.response?.data?.message || 'Error creating new post')
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={openModal}
        className={cn(
          'flex items-center justify-center w-full py-3 px-6 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition-transform duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none',
            'focus:ring-2 focus:ring-blue-500'
        )}
        aria-label="create-new-post"
      >
        <Paperclip size={20} className="mr-2" />
        New Post
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="bg-white rounded-2xl w-11/12 max-w-lg shadow-xl"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <p id="modal-title" className="font-bold text-gray-800 text-lg">
                Create New Post
              </p>
              <button
                onClick={closeModal}
                className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
                aria-label="close-modal"
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
                  aria-label="new-post-content"
              ></textarea>
              <div className="flex items-center justify-between mt-3">
                <div className="flex space-x-4 text-gray-500">
                  <label
                    className="hover:text-black transition-all cursor-pointer focus:outline-none"
                      aria-label="upload-image"
                  >
                    <ImageIcon size={20} />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                  <button className="hover:text-black transition-all focus:outline-none"  aria-label='upload-video'>
                    <Video size={20} />
                  </button>
                  <button className="hover:text-black transition-all focus:outline-none" aria-label='add-emoji'>
                    <Smile size={20} />
                  </button>
                </div>
                <span className="text-sm text-gray-400">
                  {maxCharacters - content.length} / {maxCharacters}
                </span>
              </div>
              {images.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {images.map((image, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="w-full h-20 object-cover rounded-md"
                      />
                      <button
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 focus:outline-none"
                        onClick={() =>
                          setImages((prev) =>
                            prev.filter((_, index) => index !== idx)
                          )
                        }
                        aria-label={`remove-image-${idx}`}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                  className={cn(
                     `px-5 py-2 rounded-full shadow  text-white transition-all duration-200 focus:outline-none`,
                        loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
                     )}
                onClick={handleCreateNewPost}
                disabled={loading}
                  aria-label='post-new-content'
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin text-white mr-2" />
                      Posting
                  </div>
                ) : (
                  'Post'
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