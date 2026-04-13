import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { Person } from "../../domain/Person";
export declare class CreatePersonCommand implements ICommand {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string | null;
    readonly organizationId: string;
    readonly documentId: string | null;
    readonly phone: string | null;
    readonly birthDate: Date | null;
    constructor(firstName: string, lastName: string, email: string | null, organizationId: string, documentId?: string | null, phone?: string | null, birthDate?: Date | null);
}
export interface IPersonRepository {
    save(person: Person): Promise<void>;
    findAll(): Promise<Person[]>;
    findById(id: string): Promise<Person | null>;
    findByDocumentId(documentId: string): Promise<Person | null>;
    findByOrganizationId(organizationId: string): Promise<Person[]>;
}
export declare class CreatePersonCommandHandler implements ICommandHandler<CreatePersonCommand, string> {
    private readonly personRepository;
    constructor(personRepository: IPersonRepository);
    execute(command: CreatePersonCommand): Promise<string>;
}
//# sourceMappingURL=CreatePerson.d.ts.map