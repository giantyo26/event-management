import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { City } from '../city/entities/city.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { NotFoundException } from '@nestjs/common';

describe('EventsService', () => {
  let service: EventsService;
  let eventsRepository: Repository<Event>;
  let citiesRepository: Repository<City>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: getRepositoryToken(Event),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(City),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    eventsRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    citiesRepository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new event when city is found', async () => {
        const dto: CreateEventDto = { name: 'Concert', cityId: 1, price: 50.0 };
        const city = new City();
        city.id = 1;
        city.name = 'City Name';
        const event = new Event();
        event.id = 1;
        event.name = 'Concert';
        event.price = 50.0;
        event.city = city;
  
        jest.spyOn(citiesRepository, 'findOneBy').mockResolvedValue(city);
        jest.spyOn(eventsRepository, 'create').mockReturnValue(event);
        jest.spyOn(eventsRepository, 'save').mockResolvedValue(event);
  
        const result = await service.create(dto);
        expect(result).toEqual(event);
        expect(citiesRepository.findOneBy).toHaveBeenCalledWith({ id: dto.cityId });
        expect(eventsRepository.create).toHaveBeenCalledWith({
          name: dto.name,
          city,
          price: dto.price,
        });
        expect(eventsRepository.save).toHaveBeenCalledWith(event);
      });
  
      it('should throw NotFoundException when city is not found', async () => {
        const dto: CreateEventDto = { name: 'Concert', cityId: 999, price: 50.0 };
  
        jest.spyOn(citiesRepository, 'findOneBy').mockResolvedValue(undefined);
  
        await expect(service.create(dto)).rejects.toThrow(NotFoundException);
        expect(citiesRepository.findOneBy).toHaveBeenCalledWith({ id: dto.cityId });
      });
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const mockEvents = [
        {
          id: 1,
          name: 'Event 1',
          price: 100,
          city: { id: 1, name: 'City 1', country: 'Country 1' },
        },
        {
          id: 2,
          name: 'Event 2',
          price: 200,
          city: { id: 2, name: 'City 2', country: 'Country 2' },
        },
      ] as Event[];

      jest.spyOn(eventsRepository, 'find').mockResolvedValue(mockEvents);

      const result = await service.findAll();
      expect(result).toEqual(mockEvents);
    });
  });

  describe('findOne', () => {
    it('should return the event with the given ID', async () => {
      const eventId = 1;
      const mockEvent = {
        id: eventId,
        name: 'Test Event',
        price: 100,
        city: { id: 1, name: 'Test City', country: 'Test Country' },
      } as Event;

      jest.spyOn(eventsRepository, 'findOne').mockResolvedValue(mockEvent);

      const result = await service.findOne(eventId);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('delete', () => {
    it('should delete the event with the given ID', async () => {
      const eventId = 1;
      const deleteResult = { affected: 1 };

      jest.spyOn(eventsRepository, 'delete').mockResolvedValue(deleteResult as any);

      await expect(service.delete(eventId)).resolves.toBeUndefined();
      expect(eventsRepository.delete).toHaveBeenCalledWith(eventId);
    });
  });
});
