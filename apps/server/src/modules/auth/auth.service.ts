import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import axios from 'axios';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/dto/userDto/create-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDto, SignUpDto } from 'src/dto/authDto/create-auth.dto';
import * as argon2 from 'argon2';
type UserWithoutPassword = Omit<User, 'password'>;
@Injectable()
export class AuthService {
  
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private prismaService: PrismaService,
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
  async getAccessTokenUser(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      const user = await this.prismaService.user.findFirst({
        // where: { refreshToken },
      });
      if (!user) throw new UnauthorizedException('Invalid user');
      const newAccessToken = this.jwtService.sign(
        { sub: user.id, email: user.email },
        { expiresIn: process.env.JWT_SESSION_EXPIRATION },
      );
  
      return { access_token: newAccessToken };
    } catch (err) {
      console.error('Token error:', err.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
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
  async signIn(signInDto: SignInDto) {
    const { password, email } = signInDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const passwordMatch = await argon2.verify(user.password, password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }
    const payload = { sub: user.id, email: user.email }; 
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_RT_SESSION_EXPIRATION,
    });
    // await this.prismaService.user.update({
    //   where: { id: user.id },
    //   // data: { refreshToken },
    // });
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: refreshToken,
    };
  }

  async signUp(signUpDto: SignUpDto) {
    const { email, name, password } = signUpDto;
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await argon2.hash(password);
    const newUser = await this.prismaService.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        providerId: 'jwt',
      },
    });

    return {
      userId: newUser.id,
      email: newUser.email,
    };
  }
}
