import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  type ValueTransformer,
} from 'typeorm';

export interface BaseTimeFields {
  createdAt: number;
  updatedAt: number;
  deletedAt: number | null;
}

export interface DbBaseTimeColumns {
  updated_at: string;
  created_at: string;
  deleted_at: string | null;
}

function parseUtcMillis(value: string, fieldName: string): number {
  const millis = Date.parse(value);
  if (Number.isNaN(millis)) {
    throw new Error(`Invalid UTC timestamp for ${fieldName}`);
  }
  return millis;
}

function parseUtcMillisFromDbValue(value: Date | string | null, fieldName: string): number | null {
  if (value === null) {
    return null;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  return parseUtcMillis(value, fieldName);
}

export const UTC_MILLIS_TRANSFORMER: ValueTransformer = {
  to(value: number | null | undefined): Date | null {
    if (value == null) {
      return null;
    }

    return new Date(value);
  },
  from(value: Date | string | null): number | null {
    return parseUtcMillisFromDbValue(value, 'timestamp');
  },
};

export abstract class BaseTimeEntity {
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    transformer: UTC_MILLIS_TRANSFORMER,
  })
  createdAt: number;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    transformer: UTC_MILLIS_TRANSFORMER,
  })
  updatedAt: number;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    transformer: UTC_MILLIS_TRANSFORMER,
  })
  deletedAt: number | null;
}

export function mapBaseTimeColumns(row: DbBaseTimeColumns): BaseTimeFields {
  return {
    createdAt: parseUtcMillis(row.created_at, 'created_at'),
    updatedAt: parseUtcMillis(row.updated_at, 'updated_at'),
    deletedAt: row.deleted_at ? parseUtcMillis(row.deleted_at, 'deleted_at') : null,
  };
}
