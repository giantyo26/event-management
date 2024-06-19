import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';
import { NotFoundException } from '@nestjs/common';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new event', async () => {
      const createEventDto: CreateEventDto = {
        name: 'Test Event',
        cityId: 1,
        price: 100,
      };

      const mockEvent: Event = {
        id: 1,
        name: 'Test Event',
        city: { id: 1, name: 'Test City', country: 'Test Country', events: [] },
        price: 100,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockEvent);

      const result = await controller.create(createEventDto);
      expect(result).toEqual(mockEvent);
    });
  });

  describe('findAll', () => {
    it('should return an array of events', async () => {
      const mockEvents: Event[] = [
        { id: 1, name: 'Event 1', city: { id: 1, name: 'City 1', country: 'Country 1', events: [] }, price: 100 },
        { id: 2, name: 'Event 2', city: { id: 2, name: 'City 2', country: 'Country 2', events: [] }, price: 200 },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockEvents);

      const result = await controller.findAll();
      expect(result).toEqual(mockEvents);
    });
  });

  describe('findOne', () => {
    it('should return the event with the given ID', async () => {
      const eventId = '1';
      const mockEvent: Event = { id: 1, name: 'Test Event', city: { id: 1, name: 'Test City', country: 'Test Country', events: [] }, price: 100 };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockEvent);

      const result = await controller.findOne(eventId);
      expect(result).toEqual(mockEvent);
    });

    it('should throw NotFoundException if event with given ID does not exist', async () => {
      const eventId = '999';

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(eventId)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the event with the given ID', async () => {
      const eventId = '1';

      jest.spyOn(service, 'delete').mockResolvedValue();

      await controller.delete(eventId);
      expect(service.delete).toHaveBeenCalledWith(+eventId);
    });

    it('should throw NotFoundException if event with given ID does not exist', async () => {
      const eventId = '999';

      jest.spyOn(service, 'delete').mockRejectedValue(new NotFoundException());

      await expect(controller.delete(eventId)).rejects.toThrowError(NotFoundException);
    });
  });
});
