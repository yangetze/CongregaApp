import { Person } from "../../domain/Person";
import { IPersonRepository } from "../../application/commands/CreatePerson";

export class InMemoryPersonRepository implements IPersonRepository {
    private readonly persons: Person[] = [];

    async save(person: Person): Promise<void> {
        this.persons.push(person);
    }

    async findAll(): Promise<Person[]> {
        return this.persons;
    }

    async findById(id: string): Promise<Person | null> {
        return this.persons.find(p => p.id === id) || null;
    }

    async findByDocumentId(documentId: string): Promise<Person | null> {
        return this.persons.find(p => p.documentId === documentId) || null;
    }
}
