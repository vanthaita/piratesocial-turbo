export interface Profile extends UserProfile {
  id: string,
  name: string,
  email: string,
  givenName: string,
  familyName: string,
  picture: string,
  lastActiveAt: Date,
  providerId: string,
  status: string,
  createdAt: Date,
}

export interface UserProfile {
  picture: string;
  email: string;
}
  
export interface Message {
  id: number;
  message: string;
  createdAt: string;
  senderId?: string
  sender: {
    "id": string
    "email": string,
    "picture": string,
  }
  roomId?: number
  picture?: string;
  file?: { name: string; type: string; size: number } | null;
}


export interface User {
  id: number;
  name: string;
  providerId: string;
  picture?: string;
}
export interface Comment {
  id: number;
  userId: number;
  content: string;
  createdAt: string;
  user: User;
}

export interface PostData {
  id: number;
  userId: number;
  content: string;
  imagesUrl: string[];
  createdAt: string;
  user: User;
  comments: Comment[];
  commentsCount: number;
  likesCount: number;
  retweetsCount: number;
  isLikedByUser?: boolean;
}
