import React, { useEffect, useState } from 'react';
import axiosInstance from '@/helper/axiosIntance';
import { Loader2, UserPlus, UserMinus } from 'lucide-react';
import { toast } from 'react-toastify';

interface AddNewFollowButtonProps {
  followeeId: number;
}

const AddNewFollowButton: React.FC<AddNewFollowButtonProps> = ({
  followeeId,
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await axiosInstance.get(`/follow/${followeeId}`);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };
    checkFollowStatus();
  }, [followeeId]);

  const handleFollow = async () => {
      setIsLoading(true);
      setIsFollowing(!isFollowing);
    try {
      if (isFollowing) {
        await axiosInstance.delete(`/follow/${followeeId}`);
      } else {
        await axiosInstance.post(`/follow/${followeeId}`);
      }
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
        setIsFollowing(isFollowing)
        toast.error("Could not update follow status.")
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <button
        onClick={handleFollow}
        disabled={isLoading}
        className={`flex items-center justify-center px-4 py-2.5 rounded-full text-sm font-medium transition-colors shadow-md focus:outline-none ${
            isFollowing
                ? 'bg-gray-500 hover:bg-gray-600'
                : 'bg-blue-500 hover:bg-blue-600'
        }`}
        aria-label={isFollowing ? "Unfollow" : "Follow"}
    >
      {isLoading ? (
          <Loader2 className="animate-spin mr-2" size={16}/>
        ) : isFollowing ? (
           <>
              <UserMinus className="mr-2" size={16}/>  Unfollow
           </>
        ) : (
            <>
               <UserPlus className="mr-2" size={16}/> Follow
            </>
        )}
    </button>
  );
};

export default AddNewFollowButton;