import React, { useEffect, useState } from 'react';
import axiosInstance from '@/helper/axiosIntance';
interface AddNewFollowButtonProps {
    followeeId: number;
}
const AddNewFollowButton: React.FC<AddNewFollowButtonProps> = ({ followeeId }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(false);
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
        try {
            setLoading(true);
            if (isFollowing) {
                await axiosInstance.delete(`/follow/${followeeId}`);
                setIsFollowing(false);
            } else {
                await axiosInstance.post(`/follow/${followeeId}`);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <button
            onClick={handleFollow}
            disabled={loading}
            className={`px-4 py-2.5 rounded-full ${
                isFollowing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
            } text-white text-sm font-medium transition-colors shadow-md`}
        >
            {loading ? 'Processing...' : isFollowing ? '✓ Unfollow' : '+ Follow'}
        </button>
    );
};

export default AddNewFollowButton;
