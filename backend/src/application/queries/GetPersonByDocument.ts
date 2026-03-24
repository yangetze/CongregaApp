import { IQuery, IQueryHandler } from "../../shared/cqrs/QueryBus";
import { Person } from "../../domain/Person";
import { IPersonRepository } from "../commands/CreatePerson";

export class GetPersonByDocumentQuery implements IQuery {
    constructor(
        public readonly organizationId: string,
        public readonly documentId: string
    ) {}
}

export class GetPersonByDocumentQueryHandler implements IQueryHandler<GetPersonByDocumentQuery, Person | null> {
    constructor(private readonly personRepository: IPersonRepository) {}

    async execute(query: GetPersonByDocumentQuery): Promise<Person | null> {
        const person = await this.personRepository.findByDocumentId(query.documentId);
        if (person && person.organizationId === query.organizationId) {
            return person;
        }
        return null;
    }
}
