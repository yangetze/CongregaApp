"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEventCommandHandler = exports.CreateEventCommand = void 0;
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
        const id = Math.random().toString(36).substring(2, 9);
        const sequentialId = await this.eventRepository.getNextSequentialId(command.organizationId);
        const costStructures = command.costs.map(c => new Event_1.CostStructure(c.name, c.amount, c.isMandatory));
        const ticketStructures = command.tickets.map(t => new Event_1.TicketStructure(t.name, t.price, t.quantity));
        const event = new Event_1.Event(id, sequentialId, command.name, command.startDate, command.endDate, command.totalCapacity, command.organizationId, command.hasCost, command.requirements, costStructures, ticketStructures, command.statusId);
        await this.eventRepository.save(event);
        return id;
    }
}
exports.CreateEventCommandHandler = CreateEventCommandHandler;
//# sourceMappingURL=CreateEvent.js.map