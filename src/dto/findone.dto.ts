import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Min } from 'class-validator';

export class FindOneParams {
  @ApiProperty({
    example: 1,
    required: true,
    minimum: 1,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  id: number;
}
