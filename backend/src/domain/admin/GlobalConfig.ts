export class PaymentMethod {
    constructor(
        public readonly id: string,
        public name: string,
        public currency: string,
        public createdAt: Date = new Date()
    ) {}
}

export class EventStatus {
    constructor(
        public readonly id: string,
        public name: string,
        public description: string,
        public createdAt: Date = new Date()
    ) {}
}
