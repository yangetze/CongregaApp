import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { Event, CostStructure } from "../../domain/Event";

import { EventRequirements } from "../../domain/Event";

export class CreateEventCommand implements ICommand {
    constructor(
        public readonly name: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly totalCapacity: number,
        public readonly organizationId: string,
        public readonly hasCost: boolean = false,
        public readonly requirements: EventRequirements = {},
        public readonly costs: { name: string; amount: number; isMandatory: boolean }[] = [],
        public readonly statusId: string = "DRAFT"
    ) {}
}

export interface IEventRepository {
    save(event: Event): Promise<void>;
    findAll(): Promise<Event[]>;
    findById(id: string): Promise<Event | null>;
    getNextSequentialId(organizationId: string): Promise<number>;
}

export class CreateEventCommandHandler implements ICommandHandler<CreateEventCommand, string> {
    constructor(private readonly eventRepository: IEventRepository) {}

    async execute(command: CreateEventCommand): Promise<string> {
        const id = Math.random().toString(36).substring(2, 9);
        const sequentialId = await this.eventRepository.getNextSequentialId(command.organizationId);

        const costStructures = command.costs.map(
            c => new CostStructure(c.name, c.amount, c.isMandatory)
        );

        const event = new Event(
            id,
            sequentialId,
            command.name,
            command.startDate,
            command.endDate,
            command.totalCapacity,
            command.organizationId,
            command.hasCost,
            command.requirements,
            costStructures,
            command.statusId
        );

        await this.eventRepository.save(event);
        return id;
    }
}
