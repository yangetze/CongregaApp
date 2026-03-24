import { IQuery, IQueryHandler } from "../../shared/cqrs/QueryBus";
import { Event } from "../../domain/Event";
import { IEventRepository } from "../commands/CreateEvent";

export class GetEventsQuery implements IQuery {
    constructor(public readonly organizationId: string) {}
}

export class GetEventsQueryHandler implements IQueryHandler<GetEventsQuery, Event[]> {
    constructor(private readonly eventRepository: IEventRepository) {}

    async execute(query: GetEventsQuery): Promise<Event[]> {
        const allEvents = await this.eventRepository.findAll();
        return allEvents.filter(e => e.organizationId === query.organizationId);
    }
}
