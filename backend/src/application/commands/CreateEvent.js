"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventCommandHandler = exports.CreateEventCommand = void 0;
const node_crypto_1 = require("node:crypto");
const Event_1 = require("../../domain/Event");
class CreateEventCommand {
    name;
    startDate;
    endDate;
    totalCapacity;
    organizationId;
    hasCost;
    requirements;
    costs;
    tickets;
    statusId;
    constructor(name, startDate, endDate, totalCapacity, organizationId, hasCost = false, requirements = {}, costs = [], tickets = [], statusId = "DRAFT") {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalCapacity = totalCapacity;
        this.organizationId = organizationId;
        this.hasCost = hasCost;
        this.requirements = requirements;
        this.costs = costs;
        this.tickets = tickets;
        this.statusId = statusId;
    }
}
exports.CreateEventCommand = CreateEventCommand;
class CreateEventCommandHandler {
    eventRepository;
    constructor(eventRepository) {
        this.eventRepository = eventRepository;
    }
    async execute(command) {
        const id = (0, node_crypto_1.randomUUID)();
        const sequentialId = await this.eventRepository.getNextSequentialId(command.organizationId);
        const costStructures = command.costs.map(c => new Event_1.CostStructure(c.name, c.amount, c.isMandatory));
        let finalTickets = command.tickets;
        if (!finalTickets || finalTickets.length === 0) {
            finalTickets = [{ name: 'General', price: 0, quantity: 10 }];
        }
        const ticketStructures = finalTickets.map(t => new Event_1.TicketStructure(t.name, t.price, t.quantity));
        const calculatedTotalCapacity = ticketStructures.reduce((sum, t) => sum + t.quantity, 0);
        const event = new Event_1.Event(id, sequentialId, command.name, command.startDate, command.endDate, calculatedTotalCapacity, command.organizationId, command.hasCost, command.requirements, costStructures, ticketStructures, command.statusId);
        await this.eventRepository.save(event);
        return id;
    }
}
exports.CreateEventCommandHandler = CreateEventCommandHandler;
//# sourceMappingURL=CreateEvent.js.map