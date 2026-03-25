import { ICommand, ICommandHandler } from "../../shared/cqrs/CommandBus";
import { Enrollment } from "../../domain/Event";
export declare class EnrollPersonCommand implements ICommand {
    readonly eventId: string;
    readonly personId: string;
    readonly role: string;
    constructor(eventId: string, personId: string, role: string);
}
export interface IEnrollmentRepository {
    save(enrollment: Enrollment): Promise<void>;
    findByPersonId(personId: string): Promise<Enrollment[]>;
    findByEventId(eventId: string): Promise<Enrollment[]>;
}
export declare class EnrollPersonCommandHandler implements ICommandHandler<EnrollPersonCommand, string> {
    private readonly enrollmentRepository;
    constructor(enrollmentRepository: IEnrollmentRepository);
    execute(command: EnrollPersonCommand): Promise<string>;
}
//# sourceMappingURL=EnrollPerson.d.ts.map