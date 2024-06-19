import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { City } from '../city/entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, City])],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
