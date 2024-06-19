import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { City } from './entities/city.entity';
import { NotFoundException } from '@nestjs/common';

describe('CitiesController', () => {
  let controller: CitiesController;
  let service: CitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        {
          provide: CitiesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
    service = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new city', async () => {
      const createCityDto: CreateCityDto = {
        name: 'Test City',
        country: 'Test Country',
      };

      const mockCity: City = {
        id: 1,
        name: 'Test City',
        country: 'Test Country',
        events: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockCity);

      const result = await controller.create(createCityDto);
      expect(result).toEqual(mockCity);
    });
  });

  describe('findAll', () => {
    it('should return an array of cities', async () => {
      const mockCities: City[] = [
        { id: 1, name: 'City 1', country: 'Country 1', events: [] },
        { id: 2, name: 'City 2', country: 'Country 2', events: [] },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockCities);

      const result = await controller.findAll();
      expect(result).toEqual(mockCities);
    });
  });

  describe('findOne', () => {
    it('should return the city with the given ID', async () => {
      const cityId = '1';
      const mockCity: City = { id: 1, name: 'Test City', country: 'Test Country', events: [] };

      jest.spyOn(service, 'findOne').mockResolvedValue(mockCity);

      const result = await controller.findOne(cityId);
      expect(result).toEqual(mockCity);
    });

    it('should throw NotFoundException if city with given ID does not exist', async () => {
      const cityId = '999';

      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(cityId)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete the city with the given ID', async () => {
      const cityId = '1';

      jest.spyOn(service, 'delete').mockResolvedValue();

      await controller.delete(cityId);
      expect(service.delete).toHaveBeenCalledWith(+cityId);
    });

    it('should throw NotFoundException if city with given ID does not exist', async () => {
      const cityId = '999';

      jest.spyOn(service, 'delete').mockRejectedValue(new NotFoundException());

      await expect(controller.delete(cityId)).rejects.toThrow(NotFoundException);
    });
  });
});
