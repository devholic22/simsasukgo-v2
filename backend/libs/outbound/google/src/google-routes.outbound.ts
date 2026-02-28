import { Injectable } from '@nestjs/common';
import type { GetOptimizedRouteOutput } from '@simsasukgo/shared';

const EARTH_RADIUS_KM = 6371;
const AVERAGE_TRAVEL_SPEED_KMPH = 30;

type Coordinate = {
  lat: number;
  lng: number;
};

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function calculateHaversineDistanceKm(start: Coordinate, end: Coordinate): number {
  const latDiff = toRadians(end.lat - start.lat);
  const lngDiff = toRadians(end.lng - start.lng);
  const startLat = toRadians(start.lat);
  const endLat = toRadians(end.lat);

  const a =
    Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDiff / 2) * Math.sin(lngDiff / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

@Injectable()
export class GoogleRoutesOutbound {
  async optimizeRoute(input: {
    currentLocation: { lat: number; lng: number };
    candidates: Array<{ placeId: string; lat: number; lng: number }>;
    timeWindow?: { start: string; end: string };
  }): Promise<GetOptimizedRouteOutput> {
    const orderedPlaceIds: string[] = [];
    const remaining = [...input.candidates];
    let totalDistanceKm = 0;
    let cursor: Coordinate = {
      lat: input.currentLocation.lat,
      lng: input.currentLocation.lng,
    };

    while (remaining.length > 0) {
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      for (let index = 0; index < remaining.length; index += 1) {
        const candidate = remaining[index];
        const distance = calculateHaversineDistanceKm(cursor, candidate);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      }

      const [selected] = remaining.splice(bestIndex, 1);
      if (!selected) {
        break;
      }

      orderedPlaceIds.push(selected.placeId);
      totalDistanceKm += bestDistance;
      cursor = {
        lat: selected.lat,
        lng: selected.lng,
      };
    }

    const totalTravelMinutes = Math.round((totalDistanceKm / AVERAGE_TRAVEL_SPEED_KMPH) * 60);

    return {
      orderedPlaceIds,
      totalTravelMinutes,
    };
  }
}
