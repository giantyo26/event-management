import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCityDto {
  @ApiProperty({
    example: 'Jurong',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Singapore',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  country: string;
}

export class CreateCityResponseDto {
  @ApiProperty({ example: 'Jurong' })
  name: string;

  @ApiProperty({ example: 'Singapore '})
  country: string;

  @ApiProperty({ example: 1 })
  id: number
}