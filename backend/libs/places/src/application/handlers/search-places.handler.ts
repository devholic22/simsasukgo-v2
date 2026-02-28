import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { createValidationException } from '@backend/common/errors/validation.exception';
import { isValidCoordinate, isValidRadius } from '@backend/common/geo.validator';
import { GooglePlacesOutbound } from '@backend/outbound/google/google-places.outbound';
import { SearchPlacesQuery } from '../queries/search-places.query';

@QueryHandler(SearchPlacesQuery)
export class SearchPlacesHandler implements IQueryHandler<SearchPlacesQuery> {
  constructor(private readonly googlePlacesOutbound: GooglePlacesOutbound) {}

  async execute(query: SearchPlacesQuery) {
    const textQuery = query.query?.trim();
    if (!textQuery) {
      throw createValidationException('query is required.');
    }

    if (query.location) {
      if (!isValidCoordinate(query.location)) {
        throw createValidationException('location.lat/lng must be valid coordinates.');
      }
    }

    if (query.radius != null) {
      if (!isValidRadius(query.radius)) {
        throw createValidationException('radius must be between 1 and 50000.');
      }
    }

    return this.googlePlacesOutbound.searchPlaces({
      query: textQuery,
      location: query.location,
      radius: query.radius,
    });
  }
}
