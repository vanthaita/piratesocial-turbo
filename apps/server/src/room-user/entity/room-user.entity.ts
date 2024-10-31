import { Room } from '../../room/entity/room.entity';
import { User } from '../../user/entity/user.entity';

export class RoomUser {
  id: number;
  roomId: number;
  userId: number;
  room: Room;
  user: User;
}
