import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { Event } from "../../domain/Event";
import { EventRequirements } from "../../domain/Event";
export declare class CreateEventCommand implements ICommand {
    readonly name: string;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly totalCapacity: number | null;
    readonly organizationId: string;
    readonly hasCost: boolean;
    readonly requirements: EventRequirements;
    readonly costs: {
        name: string;
        amount: number;
        isMandatory: boolean;
    }[];
    readonly tickets: {
        name: string;
        price: number;
        quantity: number;
    }[];
    readonly statusId: string;
    constructor(name: string, startDate: Date, endDate: Date, totalCapacity: number | null, organizationId: string, hasCost?: boolean, requirements?: EventRequirements, costs?: {
        name: string;
        amount: number;
        isMandatory: boolean;
    }[], tickets?: {
        name: string;
        price: number;
        quantity: number;
    }[], statusId?: string);
}
export interface IEventRepository {
    save(event: Event): Promise<void>;
    findAll(): Promise<Event[]>;
    findById(id: string): Promise<Event | null>;
    findByOrganizationId(organizationId: string): Promise<Event[]>;
    getNextSequentialId(organizationId: string): Promise<number>;
}
export declare class CreateEventCommandHandler implements ICommandHandler<CreateEventCommand, string> {
    private readonly eventRepository;
    constructor(eventRepository: IEventRepository);
    execute(command: CreateEventCommand): Promise<string>;
}
//# sourceMappingURL=CreateEvent.d.ts.map