import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({
    example: 'Jakarta Fest',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  name: string;
  
  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  cityId: number

  @ApiProperty({
    example: 200,
    required: true,
  })
  @IsNumber()
  @IsPositive()
  price: number;
}

export class CreateEventResponseDto{
  @ApiProperty({ example: 1, description: 'The ID of the event' })
  id: number;

  @ApiProperty({ example: 'Jakarta Fest', description: 'The name of the event' })
  name: string;

  @ApiProperty({ example: 1, description: 'The ID of the city associated with the event' })
  cityId: number;

  @ApiProperty({ example: 200, description: 'The price of the event' })
  price: number;
}