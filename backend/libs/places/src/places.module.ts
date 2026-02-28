import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RdbModule } from '@backend/outbound/rdb/rdb.module';
import { GoogleOutboundModule } from '@backend/outbound/google/google-outbound.module';
import { SearchPlacesHandler } from './application/handlers/search-places.handler';
import { SyncOpenStatusHandler } from './application/handlers/sync-open-status.handler';

const handlers = [SearchPlacesHandler, SyncOpenStatusHandler];

@Module({
  imports: [CqrsModule, RdbModule, GoogleOutboundModule],
  providers: [...handlers],
})
export class PlacesModule {}
