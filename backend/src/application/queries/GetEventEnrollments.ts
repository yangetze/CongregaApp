import { IQuery, IQueryHandler } from "../../shared/cqrs/QueryBus";
import { Enrollment } from "../../domain/Event";
import { IEnrollmentRepository } from "../commands/EnrollPerson";

export class GetEventEnrollmentsQuery implements IQuery {
    constructor(public readonly eventId: string) {}
}

export class GetEventEnrollmentsQueryHandler implements IQueryHandler<GetEventEnrollmentsQuery, Enrollment[]> {
    constructor(private readonly enrollmentRepository: IEnrollmentRepository) {}

    async execute(query: GetEventEnrollmentsQuery): Promise<Enrollment[]> {
        return await this.enrollmentRepository.findByEventId(query.eventId);
    }
}
