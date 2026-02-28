import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { RdbModule } from '@backend/outbound/rdb/rdb.module';
import { GoogleOutboundModule } from '@backend/outbound/google/google-outbound.module';
import { OptimizeRouteHandler } from './application/handlers/optimize-route.handler';

const handlers = [OptimizeRouteHandler];

@Module({
  imports: [CqrsModule, RdbModule, GoogleOutboundModule],
  providers: [...handlers],
})
export class RoutesModule {}
