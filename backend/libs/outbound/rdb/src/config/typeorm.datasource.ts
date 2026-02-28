import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { RDB_ENTITIES } from './typeorm.entities';
import { RDB_MIGRATIONS } from './typeorm.migrations';

const sslEnabled = process.env.DB_SSL === 'true';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  entities: [...RDB_ENTITIES],
  migrations: [...RDB_MIGRATIONS],
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
});
