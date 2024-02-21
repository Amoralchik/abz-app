import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PositionsService {
  constructor(private prisma: PrismaService) {}

  create() {
    return 'This action adds a new position';
  }

  findAll() {
    return this.prisma.position.findMany();
  }

  findOne(id: number) {
    return this.prisma.position.findMany({
      where: { id },
    });
  }

  update(id: number) {
    return `This action updates a #${id} position`;
  }

  remove(id: number) {
    return `This action removes a #${id} position`;
  }
}
