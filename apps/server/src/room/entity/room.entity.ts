import { Chat } from '../../chat/entity/chat.entity';
import { RoomUser } from '../../room-user/entity/room-user.entity';

export class Room {
  id: number;
  name: string;
  createdAt: Date;
  chats?: Chat[];
  users?: RoomUser[];
}
