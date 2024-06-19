import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto';
import { City } from '../city/entities/city.entity';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    this.logger.log(`Creating event with cityId ${dto.cityId}`);
    const city = await this.citiesRepository.findOneBy({ id: dto.cityId });
    if (!city) {
      this.logger.warn('Tried to access a city that does not exist');
      throw new NotFoundException(`City with ID ${dto.cityId} not found`);
    }

    const newEvent = this.eventsRepository.create({
      name: dto.name,
      city,
      price: dto.price,
    });

    return this.eventsRepository.save(newEvent);
  }

  async findAll(): Promise<Event[]> {
    this.logger.log(`Retrieving events`);
    return this.eventsRepository.find();
  }

  async findOne(id: number): Promise<Event> {
    this.logger.log(`Retrieving event with ID ${id}`);
    const event = await this.eventsRepository.findOne({ 
      where: { id },
      relations: { city: true }
     });
    if (!event) {
      this.logger.warn(`Event with ID ${id} not found`);
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async delete(id: number) {
    this.logger.log(`Deleting event with ID ${id}`);
    const result = await this.eventsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
  }
}
