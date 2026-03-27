export class Person {
    constructor(
        public readonly id: string,
        public firstName: string,
        public lastName: string,
        public email: string | null,
        public organizationId: string,
        public documentId: string | null = null,
        public phone: string | null = null,
        public birthDate: Date | null = null,
    ) {}

    get age(): number | null {
        if (!this.birthDate) {
            return null;
        }
        const today = new Date();
        const birthDate = new Date(this.birthDate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}
