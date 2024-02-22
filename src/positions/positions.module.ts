import { Module } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { PositionsController } from './positions.controller';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from 'src/guard/auth.service';

@Module({
  controllers: [PositionsController],
  providers: [PositionsService, PrismaService, AuthService],
})
export class PositionsModule {}
