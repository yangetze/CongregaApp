import { IQuery, IQueryHandler } from "../../shared/cqrs/QueryBus";
import { Event } from "../../domain/Event";
import { IEventRepository } from "../commands/CreateEvent";
export declare class GetEventsQuery implements IQuery {
    readonly organizationId: string;
    constructor(organizationId: string);
}
export declare class GetEventsQueryHandler implements IQueryHandler<GetEventsQuery, Event[]> {
    private readonly eventRepository;
    constructor(eventRepository: IEventRepository);
    execute(query: GetEventsQuery): Promise<Event[]>;
}
//# sourceMappingURL=GetEvents.d.ts.map