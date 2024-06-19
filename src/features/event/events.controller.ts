import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, CreateEventResponseDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { EventResponseDto } from './dto/find-event.dto';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @ApiCreatedResponse({ 
    description: 'The event has been successfully created.', 
    type: CreateEventResponseDto 
  })
  @ApiNotFoundResponse({ 
    description: 'Failed to create event because city not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 404 },
        timestamp: { type: 'string', format: 'date-time', example: '2024-06-19T08:05:26.225Z' },
        path: { type: 'string', example: '/api/v1/events' },
        message: { type: 'string', example: 'City with ID 324 not found' },
      },
    },
  })
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Retrieved all cities successfully.', type: [CreateEventResponseDto] })
  async findAll(): Promise<Event[]> {
    return this.eventsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Retrieved event successfully.', type: EventResponseDto  })
  @ApiNotFoundResponse({ 
    description: 'City not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 404 },
        timestamp: { type: 'string', format: 'date-time', example: '2024-06-19T08:05:26.225Z' },
        path: { type: 'string', example: '/api/v1/cities/5454' },
        message: { type: 'string', example: 'City with ID 5454 not found' },
      },
    },
  })
  async findOne(@Param('id') id: string): Promise<Event> {
    return this.eventsService.findOne(+id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.eventsService.delete(+id);
  }
}
