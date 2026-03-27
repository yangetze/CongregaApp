import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { randomUUID } from "node:crypto";
import { Enrollment, EnrollmentRole } from "../../domain/Event";

export class EnrollPersonCommand implements ICommand {
    constructor(
        public readonly eventId: string,
        public readonly personId: string,
        public readonly role: string
    ) {}
}

export interface IEnrollmentRepository {
    save(enrollment: Enrollment): Promise<void>;
    findByPersonId(personId: string): Promise<Enrollment[]>;
    findByEventId(eventId: string): Promise<Enrollment[]>;
}

export class EnrollPersonCommandHandler implements ICommandHandler<EnrollPersonCommand, string> {
    constructor(private readonly enrollmentRepository: IEnrollmentRepository) {}

    async execute(command: EnrollPersonCommand): Promise<string> {
        const id = randomUUID();
        const role = command.role as EnrollmentRole || EnrollmentRole.PARTICIPANT;

        const enrollment = new Enrollment(
            id,
            command.eventId,
            command.personId,
            role
        );

        await this.enrollmentRepository.save(enrollment);
        return id;
    }
}
