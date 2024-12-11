/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { caltimeAgo } from '@/lib/timeAgo';
import ImageModal from '@/components/feed/ImageModal';
import CommentModal from '@/components/feed/CommentModal';
import InteractionButtons from '@/components/feed/InteractionButtons';
import axiosInstance from '@/helper/axiosIntance';
import { usePathname } from 'next/navigation';
import { Comment, PostData } from '@/types';
import { ArrowLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Post extends PostData {
  isLikedByUser: boolean;
};

const TweetViewPage: React.FC = () => {
  const [isImageModalOpen, setIsImageModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const pathname = usePathname();
  const postId = parseInt(pathname.split('/')[4], 10);
  const [post, setPost] = useState<Post | null>(null);
  const TAKE = 10;
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const skipRef = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (postId) {
      loadPostDetails(postId);
    }
  }, [postId]);

  const loadPostDetails = async (postId: number) => {
    try {
      const responsePost = await axiosInstance.get(`/feed-posts/${postId}/details`);
      setPost(responsePost.data);
    } catch (err) {
      console.error('Error loading post details:', err);
    }
  };

  const loadComments = async () => {
    if (isLoadingComments || !hasMore) return;
    setIsLoadingComments(true);
    try {
      const responseComment = await axiosInstance.get(`/feed-posts/${postId}/comments/details`, {
        params: { skip: skipRef.current * TAKE, take: TAKE },
      });
      const newComments = responseComment.data;
      if (newComments.length === 0) {
        setHasMore(false);
      } else {
        setComments((prevComments) => [...prevComments, ...newComments]);
        skipRef.current += TAKE;
      }
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingComments || !node) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadComments();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoadingComments, hasMore]
  );

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  const openImageModal = (index: number): void => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = (): void => {
    setIsImageModalOpen(false);
    setSelectedImageIndex(null);
  };

  const handleCommentClick = (): void => {
    setIsModalOpen(true);
  };

  const closeCommentModal = (): void => {
    setIsModalOpen(false);
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col border-gray-200 hover:bg-gray-50 transition-colors">
      <div className="flex items-start space-x-4 border-b border-gray-300">
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-x-2">
              <div>
                <button onClick={() => router.back()}>
                  <ArrowLeftIcon size={18}/>                  
                </button>
              </div>
              <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300">
                {post.user.picture && (
                  <img
                    src={post.user.picture}
                    alt={`${post.user.name} profile`}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-gray-900 text-lg">{post.user.name}</p>
                <p className="text-sm text-gray-600">
                  @{post.user.providerId} · {caltimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            <button className="px-4 py-2.5 rounded-full bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors shadow-md">
              + Follow
            </button>
          </div>
          <div className="mt-2 text-gray-800">
            <p className="text-base">{post.content}</p>
          </div>
          {post.imagesUrl.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {post.imagesUrl.slice(0, 4).map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Post content ${index + 1}`}
                    className="rounded-lg object-cover w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ maxHeight: '150px' }}
                    onClick={() => openImageModal(index)}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
          <div>
            <InteractionButtons
              likeCount={post.likesCount}
              commentsCount={post.comments.length}
              retweetsCount={post.likes.length}
              handleCommentClick={handleCommentClick}
              postId={post.id}
              setLikeCount={(count) =>
                setPost((prev) => (prev ? { ...prev, likesCount: count } : prev))
              }
              isLikedByUser={post.isLikedByUser}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="mt-2 space-y-4 overflow-auto">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex flex-col items-start border-b border-gray-300 p-4">
                <div className="flex items-center gap-x-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
                    <img
                      src={comment.user.picture}
                      alt={`${comment.user.name} profile`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-x-2">
                      <p className="font-medium text-gray-900">{comment.user.name}</p>
                      <p>@{comment.user.providerId}</p>
                      <p>·</p>
                      <p className="text-sm text-gray-600">{caltimeAgo(comment.createdAt)}</p>
                    </div>
                    <p className="mt-1 text-gray-800 text-sm">{comment.content}</p>
                  </div>
                </div>
                {/* <div className="w-full mt-2">
                  <InteractionButtons
                    likeCount={post.likesCount}
                    commentsCount={post.comments.length}
                    retweetsCount={post.likes.length}
                    handleCommentClick={handleCommentClick}
                    postId={post.id}
                    setLikeCount={(count) =>
                      setPost((prev) => (prev ? { ...prev, likesCount: count } : prev))
                    }
                    isLikedByUser={post.isLikedByUser}
                  />
                </div> */}
                <div ref={lastPostRef} className="invisible" />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center p-4">
              <p className="text-gray-600 text-lg font-medium">No comments yet</p>
            </div>
          )}
        </div>
      </div>

      {isImageModalOpen && (
        <ImageModal
          imagesUrl={post.imagesUrl}
          onClose={closeImageModal}
        />
      )}
       {isModalOpen && (
        <CommentModal
          comments={post.comments}
          onClose={closeCommentModal}
          user={post.user}
          setIsModalOpen={setIsModalOpen}
          content={post.content}
          postId={post.id}
        />
      )}
    </div>
  );
};

export default TweetViewPage;
