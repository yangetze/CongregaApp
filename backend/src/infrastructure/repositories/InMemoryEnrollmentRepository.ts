import { Enrollment } from "../../domain/Event";
import { IEnrollmentRepository } from "../../application/commands/EnrollPerson";

export class InMemoryEnrollmentRepository implements IEnrollmentRepository {
    private readonly enrollments: Enrollment[] = [];

    async save(enrollment: Enrollment): Promise<void> {
        this.enrollments.push(enrollment);
    }

    async findByPersonId(personId: string): Promise<Enrollment[]> {
        return this.enrollments.filter(e => e.personId === personId);
    }

    async findByEventId(eventId: string): Promise<Enrollment[]> {
        return this.enrollments.filter(e => e.eventId === eventId);
    }
}
