import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ERROR_CODES } from '@simsasukgo/shared';
import { Repository } from 'typeorm';
import { TripDomainEntity, TripEntity } from '@backend/domain/entities/trip.entity';

export type CreateTripParams = {
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  baseLocation?: string;
};

@Injectable()
export class TripRdbRepository {
  constructor(
    @InjectRepository(TripEntity)
    private readonly repository: Repository<TripEntity>
  ) {}

  async findFirstByUserId(userId: string): Promise<TripDomainEntity | null> {
    try {
      const row = await this.repository.findOne({
        where: { userId },
        order: { createdAt: 'ASC' },
      });

      if (!row) {
        return null;
      }

      return TripDomainEntity.fromEntity(row);
    } catch {
      throw new InternalServerErrorException({
        error: {
          code: ERROR_CODES.TRIP_FETCH_FAILED,
          source: 'backend',
        },
      });
    }
  }

  async create(input: CreateTripParams): Promise<TripDomainEntity> {
    try {
      const saved = await this.repository.save(
        this.repository.create({
          userId: input.userId,
          title: input.title,
          startDate: input.startDate,
          endDate: input.endDate,
          baseLocation: input.baseLocation ?? null,
        })
      );

      return TripDomainEntity.fromEntity(saved);
    } catch {
      throw new InternalServerErrorException({
        error: {
          code: ERROR_CODES.TRIP_CREATE_FAILED,
          source: 'backend',
        },
      });
    }
  }
}
