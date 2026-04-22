"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enrollment = exports.EnrollmentRole = exports.Event = exports.EventType = exports.TicketStructure = exports.CostStructure = void 0;
class CostStructure {
    name;
    amount;
    isMandatory;
    constructor(name, amount, isMandatory) {
        this.name = name;
        this.amount = amount;
        this.isMandatory = isMandatory;
    }
}
exports.CostStructure = CostStructure;
class TicketStructure {
    name;
    price;
    quantity;
    constructor(name, price, quantity) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
    }
}
exports.TicketStructure = TicketStructure;
var EventType;
(function (EventType) {
    EventType["REGULAR"] = "REGULAR";
    EventType["JORNADA"] = "JORNADA";
})(EventType || (exports.EventType = EventType = {}));
class Event {
    id;
    sequentialId;
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
    eventType;
    constructor(id, sequentialId, name, startDate, endDate, totalCapacity, organizationId, hasCost = false, requirements = {}, costs = [], tickets = [], statusId = "DRAFT", // default status
    eventType = EventType.REGULAR) {
        this.id = id;
        this.sequentialId = sequentialId;
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
        this.eventType = eventType;
    }
}
exports.Event = Event;
var EnrollmentRole;
(function (EnrollmentRole) {
    EnrollmentRole["STAFF"] = "STAFF";
    EnrollmentRole["PARTICIPANT"] = "PARTICIPANT";
})(EnrollmentRole || (exports.EnrollmentRole = EnrollmentRole = {}));
class Enrollment {
    id;
    eventId;
    personId;
    role;
    createdAt;
    ticketNumber;
    constructor(id, eventId, personId, role = EnrollmentRole.PARTICIPANT, createdAt = new Date(), ticketNumber) {
        this.id = id;
        this.eventId = eventId;
        this.personId = personId;
        this.role = role;
        this.createdAt = createdAt;
        this.ticketNumber = ticketNumber;
    }
}
exports.Enrollment = Enrollment;
//# sourceMappingURL=Event.js.map