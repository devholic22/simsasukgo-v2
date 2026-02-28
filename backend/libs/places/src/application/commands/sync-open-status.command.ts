import type { ICommand } from '@nestjs/cqrs';

export class SyncOpenStatusCommand implements ICommand {
  constructor(public readonly placeIds: string[]) {}
}
