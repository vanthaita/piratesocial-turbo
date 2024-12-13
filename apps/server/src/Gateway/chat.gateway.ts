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
import { ChatService } from 'src/modules/chat/chat.service';
import { RoomService } from 'src/modules/room/room.service';
import { RedisService } from 'src/modules/redis/redis.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private redisSubscriber;
  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
    private readonly roomService: RoomService,
    private readonly redisService: RedisService
  ) {}

  async handleConnection(client: Socket) {
    try {
      const { profile } = client.handshake.auth;

      if (!profile) {
        throw new WsException('User profile not provided');
      }

      client.data.user = profile;
      console.log(`Client ${client.id} connected with profile: ${profile.id}`);
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
    const { user } = client.data;
    console.log(`Message from ${client.id} (user: ${user.id}):`, message);

    try {
      const sentMessage = await this.chatService.sendMessage(
        parseInt(message.roomId, 10),
        user.id,
        message.message,
      );

      this.server.to(message.roomId).emit('receiveMessage', {
        id: sentMessage.id,
        createdAt: sentMessage.createdAt,
        roomId: message.roomId,
        senderId: sentMessage.senderId,
        message: message.message,
        sender: {
          email: sentMessage.sender.email,
          picture: sentMessage.sender.picture,
        },
      });

      console.log(`Sent to room ${message.roomId}:`, {
        content: message.message,
        sender: user.email,
      });
    } catch (error) {
      console.error('Send message failed:', error.message);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: { roomId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { user } = client.data;
    console.log(`Client ${client.id} (user: ${user.id}) joining room ${roomId.roomId}`);

    try {
      await this.roomService.addUserToRoom(parseInt(roomId.roomId, 10), user.id);
      client.join(roomId.roomId);
      client.emit('joinedRoom', { roomId: roomId.roomId });

      console.log(`Client ${client.id} joined room ${roomId.roomId}`);
    } catch (error) {
      console.error('Join room failed:', error.message);
      client.emit('error', { message: 'Failed to join room' });
    }
  }

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { user } = client.data;
    console.log(`Client ${client.id} (user: ${user.id}) leaving room ${roomId}`);

    try {
      await this.roomService.removeUserFromRoom(parseInt(roomId, 10), user.id);
      client.leave(roomId);
      client.emit('leftRoom', roomId);

      console.log(`Client ${client.id} left room ${roomId}`);
    } catch (error) {
      console.error('Leave room failed:', error.message);
      client.emit('error', { message: 'Failed to leave room' });
    }
  }
  
  @SubscribeMessage('subscribeNotifications')
  async subscribeToNotifications(@ConnectedSocket() client: Socket) {
    const { user } = client.data;
    if (!user || !user.id) {
      throw new WsException('Invalid user data');
    }
    try {
      const redisClient = this.redisService.getClient();
      this.redisSubscriber = this.redisSubscriber || redisClient.duplicate();
      if (!this.redisSubscriber.status || this.redisSubscriber.status === 'end') {
        await this.redisSubscriber.connect();
      }
      const channel = `notifications:user:${user.id}`;
      await this.redisSubscriber.subscribe(channel);

      this.redisSubscriber.on('message', (subscribedChannel: string, message: string) => {
        if (subscribedChannel === channel) {
          this.server.to(client.id).emit('receiveNotification', JSON.parse(message));
        }
      });
      console.log(`Subscribed client ${client.id} to ${channel}`);
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      throw new WsException('Failed to subscribe to notifications');
    }
  }
}
