"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryGlobalConfigRepository = void 0;
const GlobalConfig_1 = require("../../../domain/admin/GlobalConfig");
class InMemoryGlobalConfigRepository {
    paymentMethods = [
        new GlobalConfig_1.PaymentMethod("1", "Zelle", "USD"),
        new GlobalConfig_1.PaymentMethod("2", "Pago Móvil", "VED")
    ];
    eventStatuses = [
        new GlobalConfig_1.EventStatus("DRAFT", "Borrador", "Evento en planificación"),
        new GlobalConfig_1.EventStatus("ACTIVE", "Activo", "Evento abierto al público"),
        new GlobalConfig_1.EventStatus("REALIZED", "Realizado", "Evento completado"),
        new GlobalConfig_1.EventStatus("CANCELLED", "Cancelado", "Evento suspendido")
    ];
    async getPaymentMethods() {
        return this.paymentMethods;
    }
    async savePaymentMethod(method) {
        this.paymentMethods.push(method);
    }
    async getEventStatuses() {
        return this.eventStatuses;
    }
    async saveEventStatus(status) {
        this.eventStatuses.push(status);
    }
}
exports.InMemoryGlobalConfigRepository = InMemoryGlobalConfigRepository;
//# sourceMappingURL=InMemoryGlobalConfigRepository.js.map