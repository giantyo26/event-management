import { City } from './src/features/city/entities/city.entity'
import { Event } from './src/features/event/entities/event.entity';
import { DataSource } from 'typeorm';

export default new DataSource({
    type: 'sqlite',
    database: 'db.sqlite3',
    migrations: ['./src/database/migrations/**/*.{ts,js}'],
    entities: [City, Event],
});