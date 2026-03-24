import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { Event } from "../../domain/Event";
export declare class CreateEventCommand implements ICommand {
    readonly name: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly totalCapacity: number;
    readonly organizationId: string;
    readonly costs: {
        name: string;
        amount: number;
        isMandatory: boolean;
    }[];
    constructor(name: string, startDate: Date, endDate: Date, totalCapacity: number, organizationId: string, costs?: {
        name: string;
        amount: number;
        isMandatory: boolean;
    }[]);
}
export interface IEventRepository {
    save(event: Event): Promise<void>;
    findAll(): Promise<Event[]>;
    findById(id: string): Promise<Event | null>;
}
export declare class CreateEventCommandHandler implements ICommandHandler<CreateEventCommand, string> {
    private readonly eventRepository;
    constructor(eventRepository: IEventRepository);
    execute(command: CreateEventCommand): Promise<string>;
}
//# sourceMappingURL=CreateEvent.d.ts.map