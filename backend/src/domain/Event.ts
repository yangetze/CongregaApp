export class CostStructure {
    constructor(
        public name: string,
        public amount: number,
        public isMandatory: boolean
    ) {}
}

export type EventRequirements = Record<string, any>;

export class TicketStructure {
    constructor(
        public name: string,
        public price: number,
        public quantity: number
    ) {}
}

export enum EventType {
    REGULAR = 'REGULAR',
    JORNADA = 'JORNADA'
}

export class Event {
    constructor(
        public readonly id: string,
        public readonly sequentialId: number,
        public name: string,
        public startDate: Date,
        public endDate: Date,
        public totalCapacity: number | null,
        public organizationId: string,
        public hasCost: boolean = false,
        public requirements: EventRequirements = {},
        public costs: CostStructure[] = [],
        public tickets: TicketStructure[] = [],
        public statusId: string = "DRAFT", // default status
        public eventType: EventType = EventType.REGULAR
    ) {}
}

export enum EnrollmentRole {
    STAFF = 'STAFF',
    PARTICIPANT = 'PARTICIPANT'
}

export class Enrollment {
    constructor(
        public readonly id: string,
        public readonly eventId: string,
        public readonly personId: string,
        public role: EnrollmentRole = EnrollmentRole.PARTICIPANT,
        public createdAt: Date = new Date()
    ) {}
}
