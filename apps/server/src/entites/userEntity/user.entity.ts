import { Chat } from "../chatEntity/chat.entity";
import { RoomUser } from "../roomUserEntity/room-user.entity";

export class User {
  id: number;
  name: string;
  email: string;
  password?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  providerId?: string;
  createdAt: Date;
  messages?: Chat[];
  rooms?: RoomUser[];
}
