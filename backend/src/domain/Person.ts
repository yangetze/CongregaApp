export class Person {
    constructor(
        public readonly id: string,
        public firstName: string,
        public lastName: string,
        public email: string | null,
        public organizationId: string,
        public documentId: string | null = null,
        public phone: string | null = null,
    ) {}
}
