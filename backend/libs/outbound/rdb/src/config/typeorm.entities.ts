import { TripEntity } from '@backend/domain/entities/trip.entity';
import { UserPreferenceEntity } from '@backend/domain/entities/user-preference.entity';

export const RDB_ENTITIES = [TripEntity, UserPreferenceEntity] as const;
