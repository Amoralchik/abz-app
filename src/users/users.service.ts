import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import tinify from 'tinify';

@Injectable()
export class UsersService {
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

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        phone,
        photo: `public/users/${photo}.png`,
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
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((u) => {
      u.photo = `http://localhost:3000/${u.photo}`;
      return u;
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user using: ${updateUserDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
