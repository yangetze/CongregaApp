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
        public readonly costs: { name: string; amount: number; isMandatory: boolean }[] = []
    ) {}
}

export interface IEventRepository {
    save(event: Event): Promise<void>;
    findAll(): Promise<Event[]>;
    findById(id: string): Promise<Event | null>;
}

export class CreateEventCommandHandler implements ICommandHandler<CreateEventCommand, string> {
    constructor(private readonly eventRepository: IEventRepository) {}

    async execute(command: CreateEventCommand): Promise<string> {
        const id = Math.random().toString(36).substring(2, 9);
        const costStructures = command.costs.map(
            c => new CostStructure(c.name, c.amount, c.isMandatory)
        );

        const event = new Event(
            id,
            command.name,
            command.startDate,
            command.endDate,
            command.totalCapacity,
            command.organizationId,
            command.hasCost,
            command.requirements,
            costStructures
        );

        await this.eventRepository.save(event);
        return id;
    }
}
