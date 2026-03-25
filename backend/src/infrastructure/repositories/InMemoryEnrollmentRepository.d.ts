import { Enrollment } from "../../domain/Event";
import { IEnrollmentRepository } from "../../application/commands/EnrollPerson";
export declare class InMemoryEnrollmentRepository implements IEnrollmentRepository {
    private readonly enrollments;
    save(enrollment: Enrollment): Promise<void>;
    findByPersonId(personId: string): Promise<Enrollment[]>;
    findByEventId(eventId: string): Promise<Enrollment[]>;
}
//# sourceMappingURL=InMemoryEnrollmentRepository.d.ts.map