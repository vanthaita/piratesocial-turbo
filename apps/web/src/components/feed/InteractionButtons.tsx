import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, MoreHorizontal, Repeat } from "lucide-react";
import axiosInstance from "@/helper/axiosIntance";

interface InteractionButtonsProps {
  postId: number,
  likeCount: number;
  commentsCount: number;
  retweetsCount: number;
  setLikeCount: (count: number) => void;
  handleCommentClick: () => void;
  isLikedByUser: boolean;
}

const InteractionButtons: React.FC<InteractionButtonsProps> = ({
  postId,
  likeCount,
  commentsCount,
  retweetsCount,
  setLikeCount,
  handleCommentClick,
  isLikedByUser = false,  
}) => {
    const [hasUserLiked, setHasUserLiked] = useState(isLikedByUser);
    useEffect(() => {
        const checkLikeStatus = async () => {
          try {
            const response = await axiosInstance.get(`/feed-posts/${postId}/liked`);
            setHasUserLiked(response.data.liked);
            console.log(hasUserLiked);
          } catch (error) {
            console.error("Error checking like status:", error);
          }
        };
        checkLikeStatus();
      }, [postId]);
    const handleLike = async () => {
        try {
        if (hasUserLiked) {
            await axiosInstance.post(`/feed-posts/unlike`);
            setLikeCount(likeCount - 1);
        } else {
            await axiosInstance.post(`/feed-posts/${postId}/like`);
            setLikeCount(likeCount + 1);
            setHasUserLiked(true);
        }
        } catch (error) {
            console.error("Error toggling like:", error);
            alert("Could not toggle like.");
        }
    };
    const handleRetweet = async () => {
        try {
          await axiosInstance.post(`/feed-posts/${postId}/retweet`);
          alert("Post retweeted!");
        } catch (error) {
          console.error("Error retweeting post:", error);
          alert("Could not retweet the post.");
        }
      };
    return (
        <div className="mt-4 flex justify-between pt-3 text-gray-500 text-sm">
            <button
                className={`flex items-center space-x-1 transition-all ${
                hasUserLiked ? "text-red-500" : "hover:text-red-500"
                }`}
                onClick={handleLike}
            >
                <Heart
                size={18}
                className={`transition-all ${
                    hasUserLiked ? "fill-current text-red-500" : ""
                }`}
                />
                <span>{likeCount} Like</span>
            </button>
            <button
                className="flex items-center space-x-1 hover:text-blue-500 transition-all"
                onClick={handleCommentClick}
            >
                <MessageCircle size={18} />
                <span>{commentsCount} Comment</span>
            </button>
            <button
                className="flex items-center space-x-1 hover:text-green-500 transition-all"
                onClick={handleRetweet}
            >
                <Repeat size={18} />
                <span>{retweetsCount} Retweet</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-500 transition-all">
                <MoreHorizontal size={18} />
            </button>
        </div>
    );
};

export default InteractionButtons;
