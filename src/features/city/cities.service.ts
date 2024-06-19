import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { CreateCityDto } from './dto';

@Injectable()
export class CitiesService {
  private readonly logger = new Logger(CitiesService.name);

  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    this.logger.log(`Creating city`);
    const newCity = this.citiesRepository.create(createCityDto);
    return this.citiesRepository.save(newCity);
  }

  async findAll(): Promise<City[]> {
    this.logger.log(`Retrieving cities`);
    return this.citiesRepository.find();
  }

  async findOne(id: number): Promise<City> {
    this.logger.log(`Retrieving city with ID ${id}`);
    const city = await this.citiesRepository.findOne({
      where: { id },
      relations: { events: true }
    })
    if (!city) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
    return city;
  }

  async delete(id: number) {
    this.logger.log(`Deleting city with ID ${id}`);
    const result = await this.citiesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`City with ID ${id} not found`);
    }
  }
}
