import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { PositionsService } from './positions.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';

@Controller('positions')
@ApiTags('positions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Get()
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            positions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        example: {
          success: true,
          positions: [
            {
              id: 1,
              name: 'Security',
            },
            {
              id: 2,
              name: 'Designer',
            },
            {
              id: 3,
              name: 'Content manager',
            },
            {
              id: 4,
              name: 'Lawyer',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            statusCode: { type: 'number' },
          },
        },
        example: {
          message: 'Forbidden resource',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  findAll() {
    return this.positionsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            positions: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                name: { type: 'string' },
              },
            },
          },
        },
        example: {
          success: true,
          positions: {
            id: 2,
            name: 'Designer',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            statusCode: { type: 'number' },
          },
        },
        example: {
          message: 'Forbidden resource',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return {
      success: true,
      positions: await this.positionsService.findOne(+id),
    };
  }
}
