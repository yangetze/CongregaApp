"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStatus = exports.PaymentMethod = void 0;
class PaymentMethod {
    id;
    name;
    currency;
    createdAt;
    constructor(id, name, currency, createdAt = new Date()) {
        this.id = id;
        this.name = name;
        this.currency = currency;
        this.createdAt = createdAt;
    }
}
exports.PaymentMethod = PaymentMethod;
class EventStatus {
    id;
    name;
    description;
    createdAt;
    constructor(id, name, description, createdAt = new Date()) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
    }
}
exports.EventStatus = EventStatus;
//# sourceMappingURL=GlobalConfig.js.map