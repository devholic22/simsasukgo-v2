import { Controller, Get, Post, Req, UnauthorizedException } from '@nestjs/common';
import { ERROR_CODES, type Trip, type UserPreference } from '@simsasukgo/shared';
import { TripRdbRepository } from '@backend/outbound/rdb/repositories/trip.rdb-repository';
import { UserPreferenceRdbRepository } from '@backend/outbound/rdb/repositories/user-preference.rdb-repository';
import { TripDomainEntity } from '@backend/domain/entities/trip.entity';
import { UserPreferenceDomainEntity } from '@backend/domain/entities/user-preference.entity';

const DEFAULT_TRIP_TITLE = '나의 첫 여행';
const DEFAULT_TRIP_DURATION_DAYS = 2;
const DEFAULT_VISITED_DISPLAY_MODE = 'gray' as const;
const DEFAULT_RADIUS_PRESET = 100 as const;
const DEFAULT_AUTO_SYNC_ENABLED = true;
const DEFAULT_AUTO_SYNC_INTERVAL_MIN = 30;

type AuthenticatedRequest = {
  userId?: string;
  user?: { id: string };
};

type BaseDataResponse = {
  trip: Trip | null;
  preference: UserPreference | null;
};

function createUnauthorizedException(): UnauthorizedException {
  return new UnauthorizedException({
    error: {
      code: ERROR_CODES.COMMON_UNAUTHORIZED,
      source: 'backend',
    },
  });
}

function toIsoString(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function toTripResponse(input: TripDomainEntity): Trip {
  return {
    id: input.id,
    userId: input.userId,
    title: input.title,
    startDate: input.startDate,
    endDate: input.endDate,
    baseLocation: input.baseLocation,
    createdAt: toIsoString(input.createdAt),
    updatedAt: toIsoString(input.updatedAt),
  };
}

function toPreferenceResponse(input: UserPreferenceDomainEntity): UserPreference {
  return {
    id: input.id,
    userId: input.userId,
    visitedDisplayMode: input.visitedDisplayMode,
    radiusPreset: input.radiusPreset,
    autoSyncEnabled: input.autoSyncEnabled,
    autoSyncIntervalMin: input.autoSyncIntervalMin,
    updatedAt: toIsoString(input.updatedAt),
  };
}

function resolveUserId(request: AuthenticatedRequest): string {
  const userId = request.userId ?? request.user?.id;
  if (typeof userId !== 'string' || userId.trim().length === 0) {
    throw createUnauthorizedException();
  }

  return userId;
}

@Controller('base-data')
export class BaseDataController {
  constructor(
    private readonly tripRepository: TripRdbRepository,
    private readonly preferenceRepository: UserPreferenceRdbRepository
  ) {}

  @Get()
  async getBaseData(@Req() request: AuthenticatedRequest): Promise<BaseDataResponse> {
    const userId = resolveUserId(request);
    return this.loadBaseDataByUserId(userId);
  }

  @Post('initialize')
  async initializeBaseData(@Req() request: AuthenticatedRequest): Promise<BaseDataResponse> {
    const userId = resolveUserId(request);

    let trip = await this.tripRepository.findFirstByUserId(userId);

    if (!trip) {
      const now = new Date();
      const end = new Date(now);
      end.setDate(now.getDate() + DEFAULT_TRIP_DURATION_DAYS);

      trip = await this.tripRepository.create({
        userId,
        title: DEFAULT_TRIP_TITLE,
        startDate: toDateOnly(now),
        endDate: toDateOnly(end),
      });
    }

    const preference = await this.preferenceRepository.upsertByUserId({
      userId,
      visitedDisplayMode: DEFAULT_VISITED_DISPLAY_MODE,
      radiusPreset: DEFAULT_RADIUS_PRESET,
      autoSyncEnabled: DEFAULT_AUTO_SYNC_ENABLED,
      autoSyncIntervalMin: DEFAULT_AUTO_SYNC_INTERVAL_MIN,
    });

    return {
      trip: toTripResponse(trip),
      preference: toPreferenceResponse(preference),
    };
  }

  private async loadBaseDataByUserId(userId: string): Promise<BaseDataResponse> {
    const [trip, preference] = await Promise.all([
      this.tripRepository.findFirstByUserId(userId),
      this.preferenceRepository.findByUserId(userId),
    ]);

    return {
      trip: trip ? toTripResponse(trip) : null,
      preference: preference ? toPreferenceResponse(preference) : null,
    };
  }
}
