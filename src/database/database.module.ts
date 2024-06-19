import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import DatabaseLogger from 'src/common/logger/database-logger';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite3',
      entities: [],
      autoLoadEntities: true,
      logger: new DatabaseLogger
    }),
  ],
})
export class DatabaseModule {}