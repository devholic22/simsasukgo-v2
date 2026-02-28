import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { createValidationException } from '@backend/common/errors/validation.exception';
import { isValidCoordinate } from '@backend/common/geo.validator';
import { GoogleRoutesOutbound } from '@backend/outbound/google/google-routes.outbound';
import { OptimizeRouteQuery } from '../queries/optimize-route.query';

@QueryHandler(OptimizeRouteQuery)
export class OptimizeRouteHandler implements IQueryHandler<OptimizeRouteQuery> {
  constructor(private readonly googleRoutesOutbound: GoogleRoutesOutbound) {}

  async execute(query: OptimizeRouteQuery) {
    const { currentLocation, candidates, timeWindow } = query;

    if (!isValidCoordinate(currentLocation)) {
      throw createValidationException('currentLocation.lat/lng must be valid coordinates.');
    }

    if (!Array.isArray(candidates) || candidates.length === 0) {
      throw createValidationException('candidates must be a non-empty array.');
    }

    const hasInvalidCandidate = candidates.some((candidate) => {
      const hasPlaceId =
        typeof candidate.placeId === 'string' && candidate.placeId.trim().length > 0;
      const hasValidCoordinate = isValidCoordinate(candidate);

      return !hasPlaceId || !hasValidCoordinate;
    });

    if (hasInvalidCandidate) {
      throw createValidationException('candidates contain invalid placeId or coordinates.');
    }

    if (timeWindow) {
      const start = Date.parse(timeWindow.start);
      const end = Date.parse(timeWindow.end);
      const hasValidRange = !Number.isNaN(start) && !Number.isNaN(end) && start < end;
      if (!hasValidRange) {
        throw createValidationException('timeWindow must have a valid start/end range.');
      }
    }

    return this.googleRoutesOutbound.optimizeRoute({
      currentLocation,
      candidates,
      timeWindow,
    });
  }
}
