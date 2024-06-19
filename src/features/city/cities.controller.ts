import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto, CreateCityResponseDto } from './dto/create-city.dto';
import { City } from './entities/city.entity';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CityResponseDto } from './dto/find-city.dto';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @ApiCreatedResponse({ 
    description: 'The city has been successfully created.', 
    type: CreateCityResponseDto 
  })
  @ApiBadRequestResponse({
    description: 'City name already exists',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer', example: 400 },
        timestamp: { type: 'string', format: 'date-time', example: '2024-06-19T08:05:26.225Z' },
        path: { type: 'string', example: '/api/v1/cities' },
        message: { type: 'string', example: 'Unique constraint violation on city' },
      },
    },
  })
  async create(@Body() createCityDto: CreateCityDto): Promise<City> {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @ApiOkResponse({ description: 'Retrieved all cities successfully.', type: [CreateCityResponseDto] })
  async findAll(): Promise<City[]> {
    return this.citiesService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Retrieved city successfully.', type: CityResponseDto })
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
  async findOne(@Param('id') id: string): Promise<City> {
    return this.citiesService.findOne(+id);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'City deleted successfully.' })
  @ApiNotFoundResponse({ description: 'City not found.' })
  async delete(@Param('id') id: string): Promise<void> {
    return this.citiesService.delete(+id);
  }
}
