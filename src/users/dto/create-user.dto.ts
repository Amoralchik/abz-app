import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsMobilePhone,
  Min,
  IsInt,
  IsPositive,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'AntonDudnik@example.mail',
    nullable: false,
    minLength: 2,
    maxLength: 100,
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  email: string;

  @ApiProperty({
    example: 'Anton Dudnik', // never ask who is this fellow
    nullable: false,
    minLength: 2,
    maxLength: 60,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(60)
  name: string;

  @ApiProperty({
    example: '+380000000003',
    nullable: false,
  })
  @IsNotEmpty()
  @IsMobilePhone()
  phone: string;

  @ApiProperty({
    example: 3,
    nullable: false,
    minimum: 1,
  })
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  positionId: number;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
  })
  photo; // temporary
}
