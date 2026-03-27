export class GetEventEnrollmentsQuery {
    constructor(public readonly eventId: string) {}
}

export class GetEventEnrollmentsQueryHandler {
    constructor(private readonly enrollmentRepository: any) {}

    async handle(query: GetEventEnrollmentsQuery): Promise<any[]> {
        return this.enrollmentRepository.findByEventId(query.eventId);
    }
}