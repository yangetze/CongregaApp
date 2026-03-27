import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { randomUUID } from "node:crypto";
import { Event, CostStructure, TicketStructure } from "../../domain/Event";

import { EventRequirements } from "../../domain/Event";

export class CreateEventCommand implements ICommand {
    constructor(
        public readonly name: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly totalCapacity: number | null,
        public readonly organizationId: string,
        public readonly hasCost: boolean = false,
        public readonly requirements: EventRequirements = {},
        public readonly costs: { name: string; amount: number; isMandatory: boolean }[] = [],
        public readonly tickets: { name: string; price: number; quantity: number }[] = [],
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
        const id = randomUUID();
        const sequentialId = await this.eventRepository.getNextSequentialId(command.organizationId);

        const costStructures = command.costs.map(
            c => new CostStructure(c.name, c.amount, c.isMandatory)
        );

        let finalTickets = command.tickets;
        if (!finalTickets || finalTickets.length === 0) {
            finalTickets = [{ name: 'General', price: 0, quantity: 10 }];
        }

        const ticketStructures = finalTickets.map(
            t => new TicketStructure(t.name, t.price, t.quantity)
        );

        const calculatedTotalCapacity = ticketStructures.reduce((sum, t) => sum + t.quantity, 0);

        const event = new Event(
            id,
            sequentialId,
            command.name,
            command.startDate,
            command.endDate,
            calculatedTotalCapacity,
            command.organizationId,
            command.hasCost,
            command.requirements,
            costStructures,
            ticketStructures,
            command.statusId
        );

        await this.eventRepository.save(event);
        return id;
    }
}
