import type { IQuery } from '@nestjs/cqrs';

export class OptimizeRouteQuery implements IQuery {
  constructor(
    public readonly currentLocation: { lat: number; lng: number },
    public readonly candidates: Array<{ placeId: string; lat: number; lng: number }>,
    public readonly timeWindow?: { start: string; end: string }
  ) {}
}
