export declare class CostStructure {
    name: string;
    amount: number;
    isMandatory: boolean;
    constructor(name: string, amount: number, isMandatory: boolean);
}
export declare class Event {
    readonly id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    totalCapacity: number;
    organizationId: string;
    costs: CostStructure[];
    constructor(id: string, name: string, startDate: Date, endDate: Date, totalCapacity: number, organizationId: string, costs?: CostStructure[]);
}
//# sourceMappingURL=Event.d.ts.map