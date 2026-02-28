import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_CODES } from '@simsasukgo/shared';
import { Repository } from 'typeorm';
import {
  UserPreferenceDomainEntity,
  UserPreferenceEntity,
  type RadiusPreset,
  type VisitedDisplayMode,
} from '@backend/domain/entities/user-preference.entity';

export type UpsertUserPreferenceParams = {
  userId: string;
  visitedDisplayMode: VisitedDisplayMode;
  radiusPreset: RadiusPreset;
  autoSyncEnabled: boolean;
  autoSyncIntervalMin: number;
};

@Injectable()
export class UserPreferenceRdbRepository {
  constructor(
    @InjectRepository(UserPreferenceEntity)
    private readonly repository: Repository<UserPreferenceEntity>
  ) {}

  async findByUserId(userId: string): Promise<UserPreferenceDomainEntity | null> {
    try {
      const row = await this.repository.findOneBy({ userId });
      if (!row) {
        return null;
      }

      return UserPreferenceDomainEntity.fromEntity(row);
    } catch {
      throw new InternalServerErrorException({
        error: {
          code: ERROR_CODES.PREFERENCE_FETCH_FAILED,
          source: 'backend',
        },
      });
    }
  }

  async upsertByUserId(input: UpsertUserPreferenceParams): Promise<UserPreferenceDomainEntity> {
    try {
      await this.repository.upsert(
        {
          userId: input.userId,
          visitedDisplayMode: input.visitedDisplayMode,
          radiusPreset: input.radiusPreset,
          autoSyncEnabled: input.autoSyncEnabled,
          autoSyncIntervalMin: input.autoSyncIntervalMin,
        },
        {
          conflictPaths: ['userId'],
        }
      );

      const row = await this.repository.findOneBy({ userId: input.userId });
      if (!row) {
        throw new InternalServerErrorException({
          error: {
            code: ERROR_CODES.PREFERENCE_UPSERT_FAILED,
            source: 'backend',
            details: 'upsert succeeded but readback returned null',
          },
        });
      }

      return UserPreferenceDomainEntity.fromEntity(row);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException({
        error: {
          code: ERROR_CODES.PREFERENCE_UPSERT_FAILED,
          source: 'backend',
        },
      });
    }
  }
}
