import { PaymentMethod, EventStatus } from "../../../domain/admin/GlobalConfig";
export interface IGlobalConfigRepository {
    getPaymentMethods(): Promise<PaymentMethod[]>;
    savePaymentMethod(method: PaymentMethod): Promise<void>;
    getEventStatuses(): Promise<EventStatus[]>;
    saveEventStatus(status: EventStatus): Promise<void>;
}
export declare class InMemoryGlobalConfigRepository implements IGlobalConfigRepository {
    private readonly paymentMethods;
    private readonly eventStatuses;
    getPaymentMethods(): Promise<PaymentMethod[]>;
    savePaymentMethod(method: PaymentMethod): Promise<void>;
    getEventStatuses(): Promise<EventStatus[]>;
    saveEventStatus(status: EventStatus): Promise<void>;
}
//# sourceMappingURL=InMemoryGlobalConfigRepository.d.ts.map