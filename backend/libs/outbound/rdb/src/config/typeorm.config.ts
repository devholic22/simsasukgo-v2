import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RDB_ENTITIES } from './typeorm.entities';
import { RDB_MIGRATIONS } from './typeorm.migrations';

export function getTypeOrmOptions(): TypeOrmModuleOptions {
  const sslEnabled = process.env.DB_SSL === 'true';
  const migrationsRunOnBoot =
    process.env.DB_MIGRATIONS_RUN_ON_BOOT == null
      ? process.env.NODE_ENV !== 'production'
      : process.env.DB_MIGRATIONS_RUN_ON_BOOT === 'true';

  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: false,
    synchronize: false,
    migrationsRun: migrationsRunOnBoot,
    entities: [...RDB_ENTITIES],
    migrations: [...RDB_MIGRATIONS],
    ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  };
}
