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
    costs;
    constructor(name, startDate, endDate, totalCapacity, organizationId, costs = []) {
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalCapacity = totalCapacity;
        this.organizationId = organizationId;
        this.costs = costs;
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
        const costStructures = command.costs.map(c => new Event_1.CostStructure(c.name, c.amount, c.isMandatory));
        const event = new Event_1.Event(id, command.name, command.startDate, command.endDate, command.totalCapacity, command.organizationId, costStructures);
        await this.eventRepository.save(event);
        return id;
    }
}
exports.CreateEventCommandHandler = CreateEventCommandHandler;
//# sourceMappingURL=CreateEvent.js.map