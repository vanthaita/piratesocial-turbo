import { Room } from '../../room/entity/room.entity';
import { User } from '../../user/entity/user.entity';

export class Chat {
  id: number;
  roomId: number;
  senderId: number;
  message: string;
  createdAt: Date;
  room: Room;
  sender: User;
}
