import { Room } from "../roomEntity/room.entity";
import { User } from "../userEntity/user.entity";


export class Chat {
  id: number;
  roomId: number;
  senderId: number;
  message: string;
  createdAt: Date;
  room: Room;
  sender: User;
}
