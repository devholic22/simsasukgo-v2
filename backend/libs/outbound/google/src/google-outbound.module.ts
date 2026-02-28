import { Module } from '@nestjs/common';
import { GooglePlacesOutbound } from './google-places.outbound';
import { GoogleRoutesOutbound } from './google-routes.outbound';

@Module({
  providers: [GooglePlacesOutbound, GoogleRoutesOutbound],
  exports: [GooglePlacesOutbound, GoogleRoutesOutbound],
})
export class GoogleOutboundModule {}
