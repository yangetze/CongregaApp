import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { Person } from "../../domain/Person";

// Command Definition
export class CreatePersonCommand implements ICommand {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string | null,
        public readonly organizationId: string,
        public readonly documentId: string | null = null,
        public readonly phone: string | null = null
    ) {}
}

// Interface for Repository Port
export interface IPersonRepository {
    save(person: Person): Promise<void>;
    findAll(): Promise<Person[]>;
    findById(id: string): Promise<Person | null>;
    findByDocumentId(documentId: string): Promise<Person | null>;
}

// Command Handler
export class CreatePersonCommandHandler implements ICommandHandler<CreatePersonCommand, string> {
    constructor(private readonly personRepository: IPersonRepository) {}

    async execute(command: CreatePersonCommand): Promise<string> {
        // Simple mock ID generation
        const id = Math.random().toString(36).substring(2, 9);
        const person = new Person(
            id,
            command.firstName,
            command.lastName,
            command.email,
            command.organizationId,
            command.documentId,
            command.phone
        );

        await this.personRepository.save(person);
        return id;
    }
}
