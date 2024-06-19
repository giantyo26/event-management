import { Module } from '@nestjs/common';
import { CitiesModule } from './city/cities.module';
import { EventsModule } from './event/events.module';
 
@Module({
    imports: [CitiesModule, EventsModule]
})
export class FeaturesModule {}
