import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { CreateCityDto } from './dto/create-city.dto';
import { NotFoundException } from '@nestjs/common';

describe('CitiesService', () => {
  let service: CitiesService;
  let citiesRepository: Repository<City>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitiesService,
        {
          provide: getRepositoryToken(City),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CitiesService>(CitiesService);
    citiesRepository = module.get<Repository<City>>(getRepositoryToken(City));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new city', async () => {
      const createCityDto: CreateCityDto = {
        name: 'Test City',
        country: 'Test Country',
      };

      const savedCity = new City();
      savedCity.id = 1;
      savedCity.name = 'Test City';
      savedCity.country = 'Test Country';

      jest.spyOn(citiesRepository, 'create').mockReturnValue(savedCity);
      jest.spyOn(citiesRepository, 'save').mockResolvedValue(savedCity);

      const result = await service.create(createCityDto);
      expect(result).toEqual(savedCity);
    });
  });

  describe('findAll', () => {
    it('should return an array of cities', async () => {
      const mockCities = [
        { id: 1, name: 'City 1', country: 'Country 1' },
        { id: 2, name: 'City 2', country: 'Country 2' },
      ] as City[];

      jest.spyOn(citiesRepository, 'find').mockResolvedValue(mockCities);

      const result = await service.findAll();
      expect(result).toEqual(mockCities);
    });
  });

  describe('findOne', () => {
    it('should return the city with the given ID', async () => {
      const cityId = 1;
      const mockCity = { id: cityId, name: 'Test City', country: 'Test Country' } as City;

      jest.spyOn(citiesRepository, 'findOne').mockResolvedValue(mockCity);

      const result = await service.findOne(cityId);
      expect(result).toEqual(mockCity);
    });
  });

  describe('delete', () => {
    it('should delete the city with the given ID', async () => {
        const deleteResult = { affected: 1 };
        jest.spyOn(citiesRepository, 'delete').mockResolvedValue(deleteResult as any);
    
        const id = 1;
        await expect(service.delete(id)).resolves.toBeUndefined();
    
        expect(citiesRepository.delete).toHaveBeenCalledWith(id);
      });    
  });
});
