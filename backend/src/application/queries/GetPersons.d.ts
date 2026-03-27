import { IQuery, IQueryHandler } from "../../shared/cqrs/QueryBus";
import { Person } from "../../domain/Person";
import { IPersonRepository } from "../commands/CreatePerson";
export declare class GetPersonsQuery implements IQuery {
    readonly organizationId: string;
    readonly search?: string | undefined;
    constructor(organizationId: string, search?: string | undefined);
}
export declare class GetPersonsQueryHandler implements IQueryHandler<GetPersonsQuery, Person[]> {
    private readonly personRepository;
    constructor(personRepository: IPersonRepository);
    execute(query: GetPersonsQuery): Promise<Person[]>;
}
//# sourceMappingURL=GetPersons.d.ts.map