import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity, mapBaseTimeColumns, type BaseTimeFields } from './base-time.entity';

export const USER_PREFERENCES_TABLE = 'user_preferences' as const;

export type VisitedDisplayMode = 'gray' | 'hidden';
export type RadiusPreset = 100 | 200 | 300 | 500 | 1000;

@Entity({ name: USER_PREFERENCES_TABLE })
@Index('idx_user_preferences_user_id', ['userId'], { unique: true })
export class UserPreferenceEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  @Column({
    name: 'visited_display_mode',
    type: 'enum',
    enum: ['gray', 'hidden'],
    default: 'gray',
  })
  visitedDisplayMode: VisitedDisplayMode;

  @Column({ name: 'radius_preset', type: 'int', default: 100 })
  radiusPreset: RadiusPreset;

  @Column({ name: 'auto_sync_enabled', type: 'boolean', default: true })
  autoSyncEnabled: boolean;

  @Column({ name: 'auto_sync_interval_min', type: 'int', default: 30 })
  autoSyncIntervalMin: number;
}

export interface DbUserPreferenceRow {
  id: string;
  user_id: string;
  visited_display_mode: VisitedDisplayMode;
  radius_preset: RadiusPreset;
  auto_sync_enabled: boolean;
  auto_sync_interval_min: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type UserPreferenceExternalData = BaseTimeFields & {
  id: string;
  userId: string;
  visitedDisplayMode: VisitedDisplayMode;
  radiusPreset: RadiusPreset;
  autoSyncEnabled: boolean;
  autoSyncIntervalMin: number;
};

export type UserPreferenceUpsertInput = {
  userId: string;
  visitedDisplayMode: VisitedDisplayMode;
  radiusPreset: RadiusPreset;
  autoSyncEnabled: boolean;
  autoSyncIntervalMin: number;
};

export class UserPreferenceDomainEntity implements BaseTimeFields {
  private constructor(
    readonly id: string,
    readonly userId: string,
    readonly visitedDisplayMode: VisitedDisplayMode,
    readonly radiusPreset: RadiusPreset,
    readonly autoSyncEnabled: boolean,
    readonly autoSyncIntervalMin: number,
    readonly createdAt: number,
    readonly updatedAt: number,
    readonly deletedAt: number | null
  ) {}

  static fromExternalData(input: UserPreferenceExternalData): UserPreferenceDomainEntity {
    return new UserPreferenceDomainEntity(
      input.id,
      input.userId,
      input.visitedDisplayMode,
      input.radiusPreset,
      input.autoSyncEnabled,
      input.autoSyncIntervalMin,
      input.createdAt,
      input.updatedAt,
      input.deletedAt
    );
  }

  static fromPersistence(row: DbUserPreferenceRow): UserPreferenceDomainEntity {
    const baseTime = mapBaseTimeColumns({
      created_at: row.created_at,
      updated_at: row.updated_at,
      deleted_at: row.deleted_at,
    });

    return new UserPreferenceDomainEntity(
      row.id,
      row.user_id,
      row.visited_display_mode,
      row.radius_preset,
      row.auto_sync_enabled,
      row.auto_sync_interval_min,
      baseTime.createdAt,
      baseTime.updatedAt,
      baseTime.deletedAt
    );
  }

  static fromEntity(
    row: Pick<
      UserPreferenceEntity,
      | 'id'
      | 'userId'
      | 'visitedDisplayMode'
      | 'radiusPreset'
      | 'autoSyncEnabled'
      | 'autoSyncIntervalMin'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
  ): UserPreferenceDomainEntity {
    return new UserPreferenceDomainEntity(
      row.id,
      row.userId,
      row.visitedDisplayMode,
      row.radiusPreset,
      row.autoSyncEnabled,
      row.autoSyncIntervalMin,
      row.createdAt,
      row.updatedAt,
      row.deletedAt
    );
  }

  static toUpsertPayload(input: UserPreferenceUpsertInput): {
    user_id: string;
    visited_display_mode: VisitedDisplayMode;
    radius_preset: RadiusPreset;
    auto_sync_enabled: boolean;
    auto_sync_interval_min: number;
  } {
    return {
      user_id: input.userId,
      visited_display_mode: input.visitedDisplayMode,
      radius_preset: input.radiusPreset,
      auto_sync_enabled: input.autoSyncEnabled,
      auto_sync_interval_min: input.autoSyncIntervalMin,
    };
  }
}

export function mapUserPreferenceEntity(row: DbUserPreferenceRow): UserPreferenceDomainEntity {
  return UserPreferenceDomainEntity.fromPersistence(row);
}

export function toUserPreferenceUpsert(input: UserPreferenceUpsertInput): {
  user_id: string;
  visited_display_mode: VisitedDisplayMode;
  radius_preset: RadiusPreset;
  auto_sync_enabled: boolean;
  auto_sync_interval_min: number;
} {
  return UserPreferenceDomainEntity.toUpsertPayload(input);
}
