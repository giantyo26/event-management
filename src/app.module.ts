import { MiddlewareConsumer, Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { FeaturesModule } from './features/features.module';
import LogsMiddleware from './common/logger/logs.middleware';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), 
    DatabaseModule,
    FeaturesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LogsMiddleware)
      .forRoutes('*');
  }
}
