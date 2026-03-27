import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { randomUUID } from "node:crypto";
import { Person } from "../../domain/Person";

// Command Definition
export class CreatePersonCommand implements ICommand {
    constructor(
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string | null,
        public readonly organizationId: string,
        public readonly documentId: string | null = null,
        public readonly phone: string | null = null,
        public readonly birthDate: Date | null = null,
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
        // Prevent duplicates based on documentId and organizationId
        if (command.documentId) {
            const existingPerson = await this.personRepository.findByDocumentId(command.documentId);
            if (existingPerson && existingPerson.organizationId === command.organizationId) {
                // Return the existing person's ID instead of throwing an error or duplicating
                return existingPerson.id;
            }
        }

        // Simple mock ID generation
        const id = randomUUID();
        const person = new Person(
            id,
            command.firstName,
            command.lastName,
            command.email,
            command.organizationId,
            command.documentId,
            command.phone,
            command.birthDate
        );

        await this.personRepository.save(person);
        return id;
    }
}
