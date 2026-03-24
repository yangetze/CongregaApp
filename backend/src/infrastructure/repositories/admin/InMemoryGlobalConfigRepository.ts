import { PaymentMethod, EventStatus } from "../../../domain/admin/GlobalConfig";

export interface IGlobalConfigRepository {
    getPaymentMethods(): Promise<PaymentMethod[]>;
    savePaymentMethod(method: PaymentMethod): Promise<void>;

    getEventStatuses(): Promise<EventStatus[]>;
    saveEventStatus(status: EventStatus): Promise<void>;
}

export class InMemoryGlobalConfigRepository implements IGlobalConfigRepository {
    private readonly paymentMethods: PaymentMethod[] = [
        new PaymentMethod("1", "Zelle", "USD"),
        new PaymentMethod("2", "Pago Móvil", "VED")
    ];

    private readonly eventStatuses: EventStatus[] = [
        new EventStatus("DRAFT", "Borrador", "Evento en planificación"),
        new EventStatus("ACTIVE", "Activo", "Evento abierto al público"),
        new EventStatus("REALIZED", "Realizado", "Evento completado"),
        new EventStatus("CANCELLED", "Cancelado", "Evento suspendido")
    ];

    async getPaymentMethods(): Promise<PaymentMethod[]> {
        return this.paymentMethods;
    }

    async savePaymentMethod(method: PaymentMethod): Promise<void> {
        this.paymentMethods.push(method);
    }

    async getEventStatuses(): Promise<EventStatus[]> {
        return this.eventStatuses;
    }

    async saveEventStatus(status: EventStatus): Promise<void> {
        this.eventStatuses.push(status);
    }
}
