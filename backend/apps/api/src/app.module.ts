import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthGuard } from '@backend/common/guards/auth.guard';
import { RdbModule } from '@backend/outbound/rdb/rdb.module';
import { PlacesModule } from '@backend/places/places.module';
import { RoutesModule } from '@backend/routes/routes.module';
import { BaseDataController } from './controllers/base-data.controller';
import { PlacesController } from './controllers/places.controller';
import { RoutesController } from './controllers/routes.controller';

@Module({
  imports: [RdbModule, CqrsModule.forRoot(), PlacesModule, RoutesModule],
  controllers: [BaseDataController, PlacesController, RoutesController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
