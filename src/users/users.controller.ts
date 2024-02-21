import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

const regExp = RegExp(/^image\/.*/);

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    content: {
      Body: {
        example: {
          user_id: 16,
          success: true,
          message: 'New user successfully registered',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Something went wrong',
    content: {
      Body: {
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
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
