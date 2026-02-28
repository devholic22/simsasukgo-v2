export type Coordinate = {
  lat: number;
  lng: number;
};

const MIN_LATITUDE = -90;
const MAX_LATITUDE = 90;
const MIN_LONGITUDE = -180;
const MAX_LONGITUDE = 180;
const MIN_RADIUS = 1;
const MAX_RADIUS = 50_000;

export function isValidLatitude(lat: number): boolean {
  return Number.isFinite(lat) && lat >= MIN_LATITUDE && lat <= MAX_LATITUDE;
}

export function isValidLongitude(lng: number): boolean {
  return Number.isFinite(lng) && lng >= MIN_LONGITUDE && lng <= MAX_LONGITUDE;
}

export function isValidCoordinate(value: Coordinate): boolean {
  return isValidLatitude(value.lat) && isValidLongitude(value.lng);
}

export function isValidRadius(radius: number): boolean {
  return Number.isFinite(radius) && radius >= MIN_RADIUS && radius <= MAX_RADIUS;
}
