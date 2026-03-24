import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { Person } from "../../domain/Person";
export declare class CreatePersonCommand implements ICommand {
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
    readonly organizationId: string;
    constructor(firstName: string, lastName: string, email: string, organizationId: string);
}
export interface IPersonRepository {
    save(person: Person): Promise<void>;
    findAll(): Promise<Person[]>;
    findById(id: string): Promise<Person | null>;
}
export declare class CreatePersonCommandHandler implements ICommandHandler<CreatePersonCommand, string> {
    private readonly personRepository;
    constructor(personRepository: IPersonRepository);
    execute(command: CreatePersonCommand): Promise<string>;
}
//# sourceMappingURL=CreatePerson.d.ts.map