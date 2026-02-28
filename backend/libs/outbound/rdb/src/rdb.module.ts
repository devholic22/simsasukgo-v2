import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getTypeOrmOptions } from './config/typeorm.config';
import { RDB_ENTITIES } from './config/typeorm.entities';
import { TripRdbRepository } from './repositories/trip.rdb-repository';
import { UserPreferenceRdbRepository } from './repositories/user-preference.rdb-repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(getTypeOrmOptions()),
    TypeOrmModule.forFeature([...RDB_ENTITIES]),
  ],
  providers: [TripRdbRepository, UserPreferenceRdbRepository],
  exports: [TypeOrmModule, TripRdbRepository, UserPreferenceRdbRepository],
})
export class RdbModule {}
