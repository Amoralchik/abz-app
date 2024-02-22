import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  Min,
  IsInt,
  IsPositive,
  Max,
  IsOptional,
} from 'class-validator';

export class findAllUserDto {
  @ApiProperty({
    example: 1,
    required: false,
    minimum: 1,
  })
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @IsOptional()
  page?: number;

  @ApiProperty({
    example: 5,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @Min(1)
  @Max(100)
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @IsOptional()
  count?: number;
}
