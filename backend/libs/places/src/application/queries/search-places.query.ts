import type { IQuery } from '@nestjs/cqrs';

export class SearchPlacesQuery implements IQuery {
  constructor(
    public readonly query: string,
    public readonly location?: { lat: number; lng: number },
    public readonly radius?: number
  ) {}
}
