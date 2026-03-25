import { IQuery, IQueryHandler } from "../../shared/cqrs/QueryBus";
import { Enrollment } from "../../domain/Event";
import { IEnrollmentRepository } from "../commands/EnrollPerson";
export declare class GetPersonEnrollmentsQuery implements IQuery {
    readonly personId: string;
    constructor(personId: string);
}
export declare class GetPersonEnrollmentsQueryHandler implements IQueryHandler<GetPersonEnrollmentsQuery, Enrollment[]> {
    private readonly enrollmentRepository;
    constructor(enrollmentRepository: IEnrollmentRepository);
    execute(query: GetPersonEnrollmentsQuery): Promise<Enrollment[]>;
}
//# sourceMappingURL=GetPersonEnrollments.d.ts.map