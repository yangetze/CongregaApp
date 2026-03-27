export declare class Person {
    readonly id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    organizationId: string;
    documentId: string | null;
    phone: string | null;
    birthDate: Date | null;
    constructor(id: string, firstName: string, lastName: string, email: string | null, organizationId: string, documentId?: string | null, phone?: string | null, birthDate?: Date | null);
    get age(): number | null;
}
//# sourceMappingURL=Person.d.ts.map