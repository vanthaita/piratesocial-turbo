import { RoomUser } from '../../room-user/entity/room-user.entity';
import { Chat } from '../../chat/entity/chat.entity';

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
