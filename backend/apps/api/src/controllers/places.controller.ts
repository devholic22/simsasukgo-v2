import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { createValidationException } from '@backend/common/errors/validation.exception';
import { SyncOpenStatusCommand } from '@backend/places/application/commands/sync-open-status.command';
import { SearchPlacesQuery } from '@backend/places/application/queries/search-places.query';

type SearchPlacesBody = {
  query: string;
  location?: { lat: number; lng: number };
  radius?: number;
};

type SyncOpenStatusBody = {
  placeIds: string[];
};

@Controller('places')
export class PlacesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Post('search')
  search(@Body() body: SearchPlacesBody) {
    if (!body?.query) {
      throw createValidationException('query is required.');
    }

    return this.queryBus.execute(new SearchPlacesQuery(body.query, body.location, body.radius));
  }

  @Post('open-status/sync')
  syncOpenStatus(@Body() body: SyncOpenStatusBody) {
    if (!Array.isArray(body?.placeIds)) {
      throw createValidationException('placeIds must be an array.');
    }

    return this.commandBus.execute(new SyncOpenStatusCommand(body.placeIds));
  }
}
