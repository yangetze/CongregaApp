import { IQuery, IQueryHandler } from "../../shared/cqrs/QueryBus";
import { Person } from "../../domain/Person";
import { IPersonRepository } from "../commands/CreatePerson";
export declare class GetPersonByDocumentQuery implements IQuery {
    readonly organizationId: string;
    readonly documentId: string;
    constructor(organizationId: string, documentId: string);
}
export declare class GetPersonByDocumentQueryHandler implements IQueryHandler<GetPersonByDocumentQuery, Person | null> {
    private readonly personRepository;
    constructor(personRepository: IPersonRepository);
    execute(query: GetPersonByDocumentQuery): Promise<Person | null>;
}
//# sourceMappingURL=GetPersonByDocument.d.ts.map