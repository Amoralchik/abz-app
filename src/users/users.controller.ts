import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { findAllUserDto } from './dto/find-all-user.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { FindOneParams } from 'src/dto/findone.dto';

const regExp = RegExp(/^image\/(jpeg|png)$/);

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            user_id: { type: 'number' },
            message: { type: 'string' },
          },
        },
        example: {
          user_id: 16,
          success: true,
          message: 'New user successfully registered',
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
  @ApiResponse({
    status: 400,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            fails: {
              type: 'object',
              properties: {
                name: {
                  type: 'array',
                  items: { type: 'string' },
                  nullable: true,
                },
                email: {
                  type: 'array',
                  items: { type: 'string' },
                  nullable: true,
                },
                phone: {
                  type: 'array',
                  items: { type: 'string' },
                  nullable: true,
                },
                position_id: {
                  type: 'array',
                  items: { type: 'string' },
                  nullable: true,
                },
                photo: {
                  type: 'array',
                  items: { type: 'string' },
                  nullable: true,
                },
              },
            },
            message: { type: 'string' },
          },
        },
        example: {
          success: false,
          message: 'Validation failed',
          fails: {
            name: ['The name must be at least 2 characters.'],
            email: ['The email must be a valid email address.'],
            phone: ['The phone field is required.'],
            position_id: ['The position id must be an integer.'],
            photo: [
              'The photo may not be greater than 5 Mbytes.',
              'Image is invalid.',
            ],
          },
        },
      },
    },
  })
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5_000_000 }),
          new FileTypeValidator({ fileType: regExp }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    return this.usersService.create(createUserDto, photo);
  }

  @Get()
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            page: { type: 'number' },
            total_pages: { type: 'number' },
            total_users: { type: 'number' },
            count: { type: 'number' },
            links: {
              type: 'object',
              properties: {
                next_url: { type: 'string', nullable: true },
                prev_url: { type: 'string', nullable: true },
              },
            },
            users: { type: 'array', items: { type: 'object' } },
          },
        },
        example: {
          success: true,
          page: 1,
          total_pages: 10,
          total_users: 47,
          count: 5,
          links: {
            next_url: 'https://example.com/api/v1/users?page=2&count=5',
            prev_url: null,
          },
          users: [
            {
              id: 1,
              email: 'Adonis92@gmail.com',
              name: 'Delbert Kunze',
              phone: '+380068409567',
              registrationTimestamp: '2024-01-22T09:33:21.913Z',
              positionId: 3,
              photo: 'http://localhost:3000/public/users/seedUser-1.png',
              position: {
                id: 3,
                name: 'Content manager',
              },
            },
            {
              id: 2,
              email: 'Rickey_Yundt67@hotmail.com',
              name: 'Daniel Brown',
              phone: '+380267876387',
              registrationTimestamp: '2024-01-17T04:30:00.559Z',
              positionId: 3,
              photo: 'http://localhost:3000/public/users/seedUser-2.png',
              position: {
                id: 3,
                name: 'Content manager',
              },
            },
            {
              id: 3,
              email: 'Althea.Wilderman33@hotmail.com',
              name: 'Jacqueline Thiel',
              phone: '+380599633405',
              registrationTimestamp: '2024-01-02T07:29:03.217Z',
              positionId: 1,
              photo: 'http://localhost:3000/public/users/seedUser-3.png',
              position: {
                id: 1,
                name: 'Security',
              },
            },
            {
              id: 4,
              email: 'Dusty.Skiles55@hotmail.com',
              name: 'Dr. Chris Davis',
              phone: '+380315185369',
              registrationTimestamp: '2024-01-01T18:32:15.866Z',
              positionId: 4,
              photo: 'http://localhost:3000/public/users/seedUser-4.png',
              position: {
                id: 4,
                name: 'Lawyer',
              },
            },
            {
              id: 5,
              email: 'Maybell.Emmerich@yahoo.com',
              name: 'Marian Kling',
              phone: '+380029529491',
              registrationTimestamp: '2024-01-14T07:02:24.341Z',
              positionId: 3,
              photo: 'http://localhost:3000/public/users/seedUser-5.png',
              position: {
                id: 3,
                name: 'Content manager',
              },
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
  @ApiResponse({
    status: 400,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            fails: {
              type: 'object',
              properties: {
                page: {
                  type: 'array',
                  items: { type: 'string' },
                  nullable: true,
                },
                count: {
                  type: 'array',
                  items: { type: 'string' },
                  nullable: true,
                },
              },
            },
            message: { type: 'string' },
          },
        },
        example: {
          success: false,
          message: 'Validation failed',
          fails: {
            page: ['The page must be a number.'],
            count: ['count must not be greater than 100'],
          },
        },
      },
    },
  })
  async findAll(@Query() query: findAllUserDto) {
    const { page, count } = query;

    const result = await this.usersService.findAll(
      page ? page : 1,
      count ? count : 5,
    );

    return {
      success: true,
      page: page ? page : 1,
      total_pages: result.totalPages,
      total_users: result.countUsers,
      count: result.count,
      links: {
        next_url: result.links.next_url,
        prev_url: result.links.prev_url,
      },
      users: result.users,
    };
  }

  @Get(':id')
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
  @ApiResponse({
    status: 200,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            users: {
              type: 'object',
              properties: {
                id: { type: 'number' },
                email: { type: 'string' },
                name: { type: 'string' },
                phone: { type: 'string' },
                registrationTimestamp: { type: 'date' },
                positionId: { type: 'number' },
                photo: { type: 'string' },
              },
            },
          },
        },
        example: {
          success: true,
          users: {
            id: 2,
            email: 'Rickey_Yundt67@hotmail.com',
            name: 'Daniel Brown',
            phone: '+380267876387',
            registrationTimestamp: '2024-01-17T04:30:00.559Z',
            positionId: 3,
            photo: 'public/users/seedUser-2.png',
          },
        },
      },
    },
  })
  findOne(@Param('id') id: FindOneParams) {
    return this.usersService.findOne(+id);
  }
}
