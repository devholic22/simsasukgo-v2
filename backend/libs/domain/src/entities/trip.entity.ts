import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import {
  BaseTimeEntity,
  mapBaseTimeColumns,
  type BaseTimeFields,
  type DbBaseTimeColumns,
} from './base-time.entity';

export const TRIPS_TABLE = 'trips' as const;

@Entity({ name: TRIPS_TABLE })
@Index('idx_trips_user_id', ['userId'])
export class TripEntity extends BaseTimeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ name: 'base_location', type: 'text', nullable: true })
  baseLocation: string | null;
}

export interface DbTripRow extends DbBaseTimeColumns {
  id: string;
  user_id: string;
  title: string;
  start_date: string;
  end_date: string;
  base_location: string | null;
}

export type TripExternalData = BaseTimeFields & {
  id: string;
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  baseLocation?: string;
};

export type TripInsertInput = {
  userId: string;
  title: string;
  startDate: string;
  endDate: string;
  baseLocation?: string;
};

export class TripDomainEntity implements BaseTimeFields {
  private constructor(
    readonly id: string,
    readonly userId: string,
    readonly title: string,
    readonly startDate: string,
    readonly endDate: string,
    readonly baseLocation: string | undefined,
    readonly createdAt: number,
    readonly updatedAt: number,
    readonly deletedAt: number | null
  ) {}

  static fromExternalData(input: TripExternalData): TripDomainEntity {
    return new TripDomainEntity(
      input.id,
      input.userId,
      input.title,
      input.startDate,
      input.endDate,
      input.baseLocation,
      input.createdAt,
      input.updatedAt,
      input.deletedAt
    );
  }

  static fromPersistence(row: DbTripRow): TripDomainEntity {
    const baseTime = mapBaseTimeColumns(row);

    return new TripDomainEntity(
      row.id,
      row.user_id,
      row.title,
      row.start_date,
      row.end_date,
      row.base_location ?? undefined,
      baseTime.createdAt,
      baseTime.updatedAt,
      baseTime.deletedAt
    );
  }

  static fromEntity(
    row: Pick<
      TripEntity,
      | 'id'
      | 'userId'
      | 'title'
      | 'startDate'
      | 'endDate'
      | 'baseLocation'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
  ): TripDomainEntity {
    return new TripDomainEntity(
      row.id,
      row.userId,
      row.title,
      row.startDate,
      row.endDate,
      row.baseLocation ?? undefined,
      row.createdAt,
      row.updatedAt,
      row.deletedAt
    );
  }

  static toInsertPayload(input: TripInsertInput): {
    user_id: string;
    title: string;
    start_date: string;
    end_date: string;
    base_location?: string;
  } {
    return {
      user_id: input.userId,
      title: input.title,
      start_date: input.startDate,
      end_date: input.endDate,
      base_location: input.baseLocation,
    };
  }
}

export function mapTripEntity(row: DbTripRow): TripDomainEntity {
  return TripDomainEntity.fromPersistence(row);
}

export function toTripInsert(input: TripInsertInput): {
  user_id: string;
  title: string;
  start_date: string;
  end_date: string;
  base_location?: string;
} {
  return TripDomainEntity.toInsertPayload(input);
}
