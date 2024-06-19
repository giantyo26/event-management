import { ApiProperty } from '@nestjs/swagger';
import { CreateCityDto } from '../../city/dto';

export class EventResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the event' })
  id: number;

  @ApiProperty({ example: 'Jakarta Fest', description: 'The name of the event' })
  name: string;

  @ApiProperty({ example: 200, description: 'The price of the event' })
  price: number;

  @ApiProperty({ type: CreateCityDto, description: 'The city associated with the event' })
  city: CreateCityDto;
}
