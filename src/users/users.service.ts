import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma.service';
import tinify from 'tinify';

@Injectable()
export class UsersService {
  host = process.env.HOST;
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, photo: Express.Multer.File) {
    tinify.key = process.env.TINIFY_API_KEY;

    const { email, name, phone, positionId } = createUserDto;

    const source = tinify.fromBuffer(photo.buffer);
    const resized = source.resize({
      method: 'cover',
      width: 70,
      height: 70,
    });
    await resized.toFile(`public/users/${photo.originalname}`);

    try {
      const user = await this.prisma.user.create({
        data: {
          email,
          name,
          phone,
          photo: `public/users/${photo.originalname}`,
          position: {
            connect: { id: +positionId },
          },
          registrationTimestamp: new Date(),
        },
      });

      return {
        success: true,
        message: 'New user successfully registered',
        user_id: user.id,
      };
    } catch (error) {
      return {
        success: true,
        message: 'User with this phone or email already exist',
      };
    }
  }

  async findAll(page: number, count: number) {
    const pageNumber = page - 1;
    const users = await this.prisma.user.findMany({
      take: count,
      skip: count * pageNumber,
      include: {
        position: true,
      },
    });
    const countUsers = await this.prisma.user.count();
    const totalPages = Math.ceil(countUsers / count);

    const formattedUsers = users.map((u) => {
      u.photo = `${this.host}${u.photo}`;
      return u;
    });

    return {
      totalPages,
      countUsers,
      count: formattedUsers.length,
      links: {
        next_url:
          pageNumber + 1 >= totalPages
            ? null
            : `${this.host}users?page=${page + 1}&count=${count}`,
        prev_url:
          pageNumber < 1
            ? null
            : `${this.host}users?page=${pageNumber}&count=${count}`,
      },
      users: formattedUsers,
    };
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}
