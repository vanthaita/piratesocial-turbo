
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
  