import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { createValidationException } from '@backend/common/errors/validation.exception';
import { GooglePlacesOutbound } from '@backend/outbound/google/google-places.outbound';
import { SyncOpenStatusCommand } from '../commands/sync-open-status.command';

@CommandHandler(SyncOpenStatusCommand)
export class SyncOpenStatusHandler implements ICommandHandler<SyncOpenStatusCommand> {
  constructor(private readonly googlePlacesOutbound: GooglePlacesOutbound) {}

  async execute(command: SyncOpenStatusCommand) {
    if (!Array.isArray(command.placeIds) || command.placeIds.length === 0) {
      throw createValidationException('placeIds must be a non-empty array.');
    }

    const normalizedPlaceIds = command.placeIds
      .map((placeId) => placeId.trim())
      .filter((placeId) => placeId.length > 0);

    if (normalizedPlaceIds.length === 0) {
      throw createValidationException('placeIds must include at least one non-empty placeId.');
    }

    const uniquePlaceIds = Array.from(new Set(normalizedPlaceIds));

    return this.googlePlacesOutbound.syncOpenStatus({
      placeIds: uniquePlaceIds,
    });
  }
}
