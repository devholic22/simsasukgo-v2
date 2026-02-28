import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ERROR_CODES,
  type OpenStatus,
  type SearchPlaceItem,
  type SyncOpenStatusItem,
} from '@simsasukgo/shared';

const GOOGLE_TEXT_SEARCH_ENDPOINT = 'https://places.googleapis.com/v1/places:searchText';
const GOOGLE_PLACE_DETAILS_ENDPOINT = 'https://places.googleapis.com/v1/places';
const GOOGLE_SEARCH_FIELD_MASK =
  'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.regularOpeningHours.weekdayDescriptions';
const GOOGLE_OPEN_STATUS_FIELD_MASK =
  'id,currentOpeningHours.openNow,currentOpeningHours.nextCloseTime';
const GOOGLE_API_TIMEOUT_MS = 8_000;

type GoogleTextSearchPlace = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  rating?: number;
  regularOpeningHours?: {
    weekdayDescriptions?: string[];
  };
};

type GoogleTextSearchResponse = {
  places?: GoogleTextSearchPlace[];
};

type GooglePlaceDetailsResponse = {
  id?: string;
  currentOpeningHours?: {
    openNow?: boolean;
    nextCloseTime?: string;
  };
};

function toBackendException(input: { statusCode: HttpStatus; details: string }): HttpException {
  return new HttpException(
    {
      error: {
        code: ERROR_CODES.COMMON_UNKNOWN,
        source: 'backend',
        details: input.details,
      },
    },
    input.statusCode
  );
}

function mapOpenStatus(openNow: boolean | undefined): OpenStatus {
  if (openNow === true) {
    return 'open';
  }

  if (openNow === false) {
    return 'closed';
  }

  return 'unknown';
}

function mapSearchPlaceItem(place: GoogleTextSearchPlace): SearchPlaceItem | null {
  const placeId = place.id;
  const name = place.displayName?.text;
  const address = place.formattedAddress;
  const lat = place.location?.latitude;
  const lng = place.location?.longitude;

  if (
    !placeId ||
    !name ||
    !address ||
    typeof lat !== 'number' ||
    typeof lng !== 'number' ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return null;
  }

  const weekdayDescriptions = place.regularOpeningHours?.weekdayDescriptions;
  const openingHoursSummary =
    Array.isArray(weekdayDescriptions) && weekdayDescriptions.length > 0
      ? weekdayDescriptions.join(' / ')
      : undefined;

  return {
    placeId,
    name,
    address,
    location: {
      lat,
      lng,
    },
    rating: typeof place.rating === 'number' ? place.rating : undefined,
    openingHoursSummary,
  };
}

function getGoogleApiKey(): string {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY?.trim();

  if (!apiKey) {
    throw toBackendException({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      details: 'GOOGLE_MAPS_API_KEY is not configured.',
    });
  }

  return apiKey;
}

@Injectable()
export class GooglePlacesOutbound {
  async searchPlaces(input: {
    query: string;
    location?: { lat: number; lng: number };
    radius?: number;
  }): Promise<SearchPlaceItem[]> {
    const apiKey = getGoogleApiKey();
    const body: {
      textQuery: string;
      locationBias?: {
        circle: {
          center: { latitude: number; longitude: number };
          radius: number;
        };
      };
    } = {
      textQuery: input.query,
    };

    if (input.location && input.radius) {
      body.locationBias = {
        circle: {
          center: {
            latitude: input.location.lat,
            longitude: input.location.lng,
          },
          radius: input.radius,
        },
      };
    }

    const response = await fetch(GOOGLE_TEXT_SEARCH_ENDPOINT, {
      method: 'POST',
      signal: AbortSignal.timeout(GOOGLE_API_TIMEOUT_MS),
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': GOOGLE_SEARCH_FIELD_MASK,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw toBackendException({
        statusCode: HttpStatus.BAD_GATEWAY,
        details: `Google Places text search failed: ${response.status}`,
      });
    }

    const raw = (await response.json()) as GoogleTextSearchResponse;
    const places = Array.isArray(raw.places) ? raw.places : [];

    return places
      .map((place) => mapSearchPlaceItem(place))
      .filter((place): place is SearchPlaceItem => place !== null);
  }

  async syncOpenStatus(input: { placeIds: string[] }): Promise<SyncOpenStatusItem[]> {
    const apiKey = getGoogleApiKey();

    const results = await Promise.all(
      input.placeIds.map(async (placeId) => {
        try {
          const response = await fetch(
            `${GOOGLE_PLACE_DETAILS_ENDPOINT}/${encodeURIComponent(placeId)}`,
            {
              method: 'GET',
              signal: AbortSignal.timeout(GOOGLE_API_TIMEOUT_MS),
              headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                'X-Goog-FieldMask': GOOGLE_OPEN_STATUS_FIELD_MASK,
              },
            }
          );

          if (!response.ok) {
            return {
              placeId,
              openStatus: 'unknown',
            } as SyncOpenStatusItem;
          }

          const raw = (await response.json()) as GooglePlaceDetailsResponse;
          const openNow = raw.currentOpeningHours?.openNow;

          return {
            placeId,
            openStatus: mapOpenStatus(openNow),
            openNow: typeof openNow === 'boolean' ? openNow : undefined,
            nextCloseTime:
              typeof raw.currentOpeningHours?.nextCloseTime === 'string'
                ? raw.currentOpeningHours.nextCloseTime
                : undefined,
          } as SyncOpenStatusItem;
        } catch {
          return {
            placeId,
            openStatus: 'unknown',
          } as SyncOpenStatusItem;
        }
      })
    );

    return results;
  }
}
