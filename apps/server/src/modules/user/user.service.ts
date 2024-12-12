import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/userDto/create-user.dto';
import { UpdateUserDto } from '../../dto/userDto/update-user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { UserStatus } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async updateUserStatus(): Promise<void> {
    const now = new Date();
    await this.prisma.user.updateMany({
      where: {
        lastActiveAt: {
          gte: new Date(now.getTime() - 5 * 60 * 1000), // Hoạt động trong vòng 5 phút
        },
      },
      data: { status: UserStatus.ONLINE },
    });
    await this.prisma.user.updateMany({
      where: {
        lastActiveAt: {
          gte: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // Hoạt động trong 3 ngày qua
          lt: new Date(now.getTime() - 5 * 60 * 1000),
        },
      },
      data: { status: UserStatus.ACTIVE },
    });
    await this.prisma.user.updateMany({
      where: {
        lastActiveAt: {
          lt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // Không hoạt động hơn 3 ngày
        },
      },
      data: { status: UserStatus.INACTIVE },
    });
  }
  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async createManyUsers(data: CreateUserDto[]) {
    return this.prisma.user.createMany({ data });
  }

  async getUser(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        givenName: true,
        familyName: true,
        picture: true,
        lastActiveAt: true,
        providerId: true,
        status: true,
        createdAt: true,
        followers: {
          select: {
            follower: {
              select: {
                id: true,
                name: true,
                picture: true,
                providerId: true,
              },
            },
          },
        },
        following: {
          select: {
            followee: {
              select: {
                id: true,
                name: true,
                picture: true,
              },
            },
          },
        },
        feedPosts: true,
      },
    });
  }

  async getAll() {
    return this.prisma.user.findMany();
  }

  async updateUser(id: number, data: UpdateUserDto) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async findOneBy(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async insertOne(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }
}
