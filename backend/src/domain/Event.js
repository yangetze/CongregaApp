"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.CostStructure = void 0;
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
class Event {
    id;
    name;
    startDate;
    endDate;
    totalCapacity;
    organizationId;
    costs;
    constructor(id, name, startDate, endDate, totalCapacity, organizationId, costs = []) {
        this.id = id;
        this.name = name;
        this.startDate = startDate;
        this.endDate = endDate;
        this.totalCapacity = totalCapacity;
        this.organizationId = organizationId;
        this.costs = costs;
    }
}
exports.Event = Event;
//# sourceMappingURL=Event.js.map