import { Body, Controller, Post } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { createValidationException } from '@backend/common/errors/validation.exception';
import { OptimizeRouteQuery } from '@backend/routes/application/queries/optimize-route.query';

type OptimizeRouteBody = {
  currentLocation: { lat: number; lng: number };
  candidates: Array<{ placeId: string; lat: number; lng: number }>;
  timeWindow?: { start: string; end: string };
};

@Controller('routes')
export class RoutesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Post('optimize')
  optimize(@Body() body: OptimizeRouteBody) {
    if (!body?.currentLocation) {
      throw createValidationException('currentLocation is required.');
    }

    if (!Array.isArray(body.candidates)) {
      throw createValidationException('candidates must be an array.');
    }

    return this.queryBus.execute(
      new OptimizeRouteQuery(body.currentLocation, body.candidates, body.timeWindow)
    );
  }
}
