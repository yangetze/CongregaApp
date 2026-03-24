import { IQuery, IQueryHandler } from "../../shared/cqrs/QueryBus";
import { Enrollment } from "../../domain/Event";
import { IEnrollmentRepository } from "../commands/EnrollPerson";

export class GetPersonEnrollmentsQuery implements IQuery {
    constructor(public readonly personId: string) {}
}

export class GetPersonEnrollmentsQueryHandler implements IQueryHandler<GetPersonEnrollmentsQuery, Enrollment[]> {
    constructor(private readonly enrollmentRepository: IEnrollmentRepository) {}

    async execute(query: GetPersonEnrollmentsQuery): Promise<Enrollment[]> {
        return await this.enrollmentRepository.findByPersonId(query.personId);
    }
}
