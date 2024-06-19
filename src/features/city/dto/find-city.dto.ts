import { ApiProperty } from '@nestjs/swagger';
import { CreateEventResponseDto } from '../../event/dto';

export class CityResponseDto {
  @ApiProperty({ example: 1, description: 'The ID of the city' })
  id: number;

  @ApiProperty({ example: 'Jakarta', description: 'The name of the city' })
  name: string;

  @ApiProperty({ example: 'Indonesia', description: 'The country of the city' })
  country: string;

  @ApiProperty({ type: () => [CreateEventResponseDto], description: 'Events associated with the city' })
  events: CreateEventResponseDto[];
}
