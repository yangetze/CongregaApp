export declare class CostStructure {
    name: string;
    amount: number;
    isMandatory: boolean;
    constructor(name: string, amount: number, isMandatory: boolean);
}
export type EventRequirements = Record<string, any>;
export declare class TicketStructure {
    name: string;
    price: number;
    quantity: number;
    constructor(name: string, price: number, quantity: number);
}
export declare class Event {
    readonly id: string;
    readonly sequentialId: number;
    name: string;
    startDate: Date;
    endDate: Date;
    totalCapacity: number | null;
    organizationId: string;
    hasCost: boolean;
    requirements: EventRequirements;
    costs: CostStructure[];
    tickets: TicketStructure[];
    statusId: string;
    constructor(id: string, sequentialId: number, name: string, startDate: Date, endDate: Date, totalCapacity: number | null, organizationId: string, hasCost?: boolean, requirements?: EventRequirements, costs?: CostStructure[], tickets?: TicketStructure[], statusId?: string);
}
export declare enum EnrollmentRole {
    STAFF = "STAFF",
    PARTICIPANT = "PARTICIPANT"
}
export declare class Enrollment {
    readonly id: string;
    readonly eventId: string;
    readonly personId: string;
    role: EnrollmentRole;
    createdAt: Date;
    constructor(id: string, eventId: string, personId: string, role?: EnrollmentRole, createdAt?: Date);
}
//# sourceMappingURL=Event.d.ts.map