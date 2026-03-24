export class CostStructure {
    constructor(
        public name: string,
        public amount: number,
        public isMandatory: boolean
    ) {}
}

export class Event {
    constructor(
        public readonly id: string,
        public name: string,
        public startDate: Date,
        public endDate: Date,
        public totalCapacity: number,
        public organizationId: string,
        public costs: CostStructure[] = []
    ) {}
}
