import { IQuery, IQueryHandler } from "../../shared/cqrs/QueryBus";
import { Person } from "../../domain/Person";
import { IPersonRepository } from "../commands/CreatePerson";

export class GetPeopleQuery implements IQuery {
    constructor(public readonly organizationId: string) {}
}

export class GetPeopleQueryHandler implements IQueryHandler<GetPeopleQuery, Person[]> {
    constructor(private readonly personRepository: IPersonRepository) {}

    async execute(query: GetPeopleQuery): Promise<Person[]> {
        const allPeople = await this.personRepository.findAll();
        // Return only the ones matching the organization
        return allPeople.filter(p => p.organizationId === query.organizationId);
    }
}
