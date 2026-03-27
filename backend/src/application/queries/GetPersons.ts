import { IQuery, IQueryHandler } from "../../shared/cqrs/QueryBus";
import { Person } from "../../domain/Person";
import { IPersonRepository } from "../commands/CreatePerson";

export class GetPersonsQuery implements IQuery {
    constructor(
        public readonly organizationId: string,
        public readonly search?: string
    ) {}
}

export class GetPersonsQueryHandler implements IQueryHandler<GetPersonsQuery, Person[]> {
    constructor(private readonly personRepository: IPersonRepository) {}

    async execute(query: GetPersonsQuery): Promise<Person[]> {
        const allPeople = await this.personRepository.findAll();

        let filtered = allPeople.filter(p => p.organizationId === query.organizationId);

        if (query.search) {
            const searchLower = query.search.toLowerCase();
            filtered = filtered.filter(p => {
                const matchDocument = p.documentId?.toLowerCase().includes(searchLower);
                const matchFirst = p.firstName?.toLowerCase().includes(searchLower);
                const matchLast = p.lastName?.toLowerCase().includes(searchLower);
                const matchEmail = p.email?.toLowerCase().includes(searchLower);

                return matchDocument || matchFirst || matchLast || matchEmail;
            });
        }

        return filtered;
    }
}
