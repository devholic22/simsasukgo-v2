export type PlaceCategory = 'food' | 'place' | 'stay';
export type OpenStatus = 'open' | 'closed' | 'unknown';
export type VisitedDisplayMode = 'gray' | 'hidden';
export type RadiusPreset = 100 | 200 | 300 | 500 | 1000;

export interface Trip {
  id: string;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  baseLocation?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Place {
  id: string;
  tripId: string;
  googlePlaceId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: PlaceCategory;
  memoMenu?: string;
  tags: string[];
  distanceFromCurrent?: number;
  openStatus: OpenStatus;
  openStatusUpdatedAt?: string;
  visited: boolean;
  visitedAt?: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreference {
  id: string;
  userId: string;
  visitedDisplayMode: VisitedDisplayMode;
  radiusPreset: RadiusPreset;
  autoSyncEnabled: boolean;
  autoSyncIntervalMin: number;
  updatedAt: string;
}

export interface SyncLog {
  id: string;
  userId: string;
  syncedAt: string;
  successCount: number;
  failedCount: number;
  errorSummary?: string;
}

export interface SearchPlacesInput {
  query: string;
  location?: { lat: number; lng: number };
  radius?: number;
}

export interface SearchPlaceItem {
  placeId: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  rating?: number;
  openingHoursSummary?: string;
}

export interface SyncOpenStatusInput {
  placeIds: string[];
}

export interface SyncOpenStatusItem {
  placeId: string;
  openStatus: OpenStatus;
  openNow?: boolean;
  nextCloseTime?: string;
}

export interface GetOptimizedRouteInput {
  currentLocation: { lat: number; lng: number };
  candidates: Array<{ placeId: string; lat: number; lng: number }>;
  timeWindow?: { start: string; end: string };
}

export interface GetOptimizedRouteOutput {
  orderedPlaceIds: string[];
  totalTravelMinutes?: number;
}
