import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from 'src/chat/chat.service';
import { RoomService } from 'src/room/room.service';
// interface Message {
//   id: number;
//   message: string;
//   createdAt: string;
//   sender?: string;
//   roomId?: number;
//   file?: any;
// }
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
  ) {}
  async handleConnection(client: Socket) {
    try {
      const { profile } = client.handshake.auth;

      if (!profile) {
        throw new WsException('User profile not provided');
      }

      client.data.user = profile;

      console.log(
        `Client ${client.id} connected with user profile: ${JSON.stringify(profile.id)}`,
      );
    } catch (error) {
      console.error('Authentication failed:', error.message);
      client.disconnect();
      throw new WsException('Authentication failed');
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() message: { message: string; roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userProfile = client.data.user;

    console.log(
      `Received message from client ${client.id} (user profile: ${JSON.stringify(userProfile.id)}):`,
      message,
    );

    try {
      const sending = await this.chatService.sendMessage(
        parseInt(message.roomId, 10),
        userProfile.id,
        message.message,
      );
      this.server.to(message.roomId).emit('receiveMessage', {
        id: sending.id,
        createdAt: sending.createdAt,
        roomId: message.roomId,
        senderId: sending.senderId,
        message: message.message,
        sender: {
          email: sending.sender.email,
          picture: sending.sender.picture,
        },
      });

      console.log(`Message sent to room ${message.roomId}:`, {
        content: message.message,
        sender: userProfile.email,
      });
    } catch (error) {
      console.error('Failed to send message:', error.message);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userProfile = client.data.user;

    console.log(
      `Client ${client.id} (user profile: ${JSON.stringify(userProfile.id)}) joining room ${roomId.roomId}`,
    );

    try {
      await this.roomService.addUserToRoom(
        parseInt(roomId.roomId, 10),
        userProfile.id,
      );
      client.join(roomId.roomId);
      client.emit('joinedRoom', { roomId: roomId.roomId });

      console.log(
        `Client ${client.id} (user profile: ${JSON.stringify(userProfile.id)}) successfully joined room ${roomId.roomId}`,
      );
    } catch (error) {
      console.error('Failed to join room:', error.message);
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const userProfile = client.data.user;
    console.log(
      `Client ${client.id} (user profile: ${JSON.stringify(userProfile.id)}) leaving room ${roomId}`,
    );

    try {
      await this.roomService.removeUserFromRoom(
        parseInt(roomId, 10),
        userProfile.id,
      );
      client.leave(roomId);
      client.emit('leftRoom', roomId);

      console.log(
        `Client ${client.id} (user profile: ${JSON.stringify(userProfile.id)}) left room ${roomId}`,
      );
    } catch (error) {
      console.error('Failed to leave room:', error.message);
      client.emit('error', { message: 'Failed to leave room' });
    }
  }
}
