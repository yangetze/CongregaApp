import { IQuery, IQueryHandler } from "../../shared/cqrs/QueryBus";
import { Person } from "../../domain/Person";
import { IPersonRepository } from "../commands/CreatePerson";
export declare class GetPeopleQuery implements IQuery {
    readonly organizationId: string;
    constructor(organizationId: string);
}
export declare class GetPeopleQueryHandler implements IQueryHandler<GetPeopleQuery, Person[]> {
    private readonly personRepository;
    constructor(personRepository: IPersonRepository);
    execute(query: GetPeopleQuery): Promise<Person[]>;
}
//# sourceMappingURL=GetPeople.d.ts.map