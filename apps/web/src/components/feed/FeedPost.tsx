
/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect } from "react";
import { caltimeAgo } from "@/lib/timeAgo";
import { useRouter } from "next/navigation";
import CommentModal from "./CommentModal";
import ImageModal from "./ImageModal";
import InteractionButtons from "./InteractionButtons";
import { PostData } from "@/types";


const FeedPost: React.FC<PostData> = ({
  id,
  content,
  imagesUrl,
  createdAt,
  user,
  likesCount,
  commentsCount,
  retweetsCount,
  comments,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(likesCount);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const router = useRouter();
  const handleCommentClick = () => {
    setIsModalOpen(true);
  };

  const closeCommentModal = () => {
    setIsModalOpen(false);
  };
  const openImageModal = (index: number) => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <>
      <div className=" border-b border-gray-300 p-4 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
        
      >
        <div className="flex items-start space-x-3"
         
        >
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 ">
            <img
              src={user.picture}
              alt={`${user.name} profile`}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex-1">
            <div className="flex justify-between cursor-pointer"
              onClick={() => {
                router.push(`profile/${user.id}/post/${id}`)
              }}
            >
              <div>
                <p className="font-semibold text-gray-900 text-lg">{user.name}</p>
                <p className="text-sm text-gray-600">
                  {user.providerId} · {caltimeAgo(createdAt)}
                </p>
              </div>

            </div>
            <div className="mt-2 text-gray-800">
              <p className="text-base">{content}</p>
            </div>
            {imagesUrl.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {imagesUrl.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post content ${index + 1}`}
                    className="rounded-lg object-cover w-full h-full cursor-pointer hover:opacity-90"
                    style={{ maxHeight: "150px" }}
                    onClick={() => openImageModal(index)}
                    loading="lazy"
                  />
                ))}
              </div>
            )}
            <InteractionButtons 
              postId={id}
              likeCount={likeCount}
              commentsCount={commentsCount}
              retweetsCount={retweetsCount}
              setLikeCount={setLikeCount}
              handleCommentClick={handleCommentClick}
              isLikedByUser={false}
            />
          </div>
        </div>
      </div>
      {isImageModalOpen && (
        <ImageModal 
          imagesUrl={imagesUrl}
          onClose={closeImageModal}
        />
      )}
      {isModalOpen && (
        <CommentModal
        comments={comments}
        setIsModalOpen={setIsModalOpen}
        onClose={closeCommentModal}
        user={user}
        content={content}
        postId={id}
      />
      )}
    </>
  );
};

export default FeedPost;
