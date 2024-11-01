import { Room } from "../roomEntity/room.entity";
import { User } from "../userEntity/user.entity";

export class RoomUser {
  id: number;
  roomId: number;
  userId: number;
  room: Room;
  user: User;
}
