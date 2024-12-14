import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/dto/userDto/create-user.dto';
import { User } from '@prisma/client';
type UserWithoutPassword = Omit<User, 'password'>;
@Injectable()
export class AuthService {
  
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
  ) {}

  async authenticate(token: string) {
    const profile = await this.getProfile(token);

    let user = await this.usersService.findOneBy(profile.data.email);

    if (!user) {
      const userDto = <CreateUserDto>{
        email: profile.data.email,
        name: profile.data.name,
        givenName: profile.data.given_name,
        familyName: profile.data.family_name,
        picture: profile.data.picture,
        providerId: profile.data.id,
      };

      user = await this.usersService.insertOne(userDto);
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async getNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://accounts.google.com/o/oauth2/token',
        {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to refresh the access token.');
    }
  }

  async getProfile(token: string) {
    try {
      return axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }

  async getUser(email: string): Promise<UserWithoutPassword> {
    try {
      return await this.usersService.findOneBy(email);
    } catch (error) {
      console.error('Failed to revoke email:', error);
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );

      const expiresIn = response.data.expires_in;

      if (!expiresIn || expiresIn <= 0) {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  async revokeGoogleToken(token: string) {
    try {
      await axios.get(
        `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }
}
