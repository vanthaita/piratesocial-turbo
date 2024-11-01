import { PartialType } from '@nestjs/mapped-types';
import { CreateRoomUserDto } from './create-room-user.dto';

export class UpdateRoomUserDto extends PartialType(CreateRoomUserDto) {}
