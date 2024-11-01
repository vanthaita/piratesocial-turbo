import { Chat } from "../chatEntity/chat.entity";
import { RoomUser } from "../roomUserEntity/room-user.entity";

export class Room {
  id: number;
  name: string;
  createdAt: Date;
  chats?: Chat[];
  users?: RoomUser[];
}
