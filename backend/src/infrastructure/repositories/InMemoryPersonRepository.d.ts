import { Person } from "../../domain/Person";
import { IPersonRepository } from "../../application/commands/CreatePerson";
export declare class InMemoryPersonRepository implements IPersonRepository {
    private readonly persons;
    save(person: Person): Promise<void>;
    findAll(): Promise<Person[]>;
    findById(id: string): Promise<Person | null>;
}
//# sourceMappingURL=InMemoryPersonRepository.d.ts.map