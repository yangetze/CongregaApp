import { EnrollPersonCommand, EnrollPersonCommandHandler } from "../src/application/commands/EnrollPerson";
import { InMemoryEnrollmentRepository } from "../src/infrastructure/repositories/InMemoryEnrollmentRepository";
import { EnrollmentRole } from "../src/domain/Event";

describe("EnrollPersonCommandHandler", () => {
    it("should create an enrollment with the specified role and return an id", async () => {
        // Arrange
        const repository = new InMemoryEnrollmentRepository();
        const handler = new EnrollPersonCommandHandler(repository);
        const command = new EnrollPersonCommand(
            "event-1",
            "person-1",
            EnrollmentRole.STAFF
        );

        // Act
        const id = await handler.execute(command);
        const eventEnrollments = await repository.findByEventId("event-1");

        // Assert
        expect(id).toBeDefined();
        expect(typeof id).toBe("string");
        expect(id.length).toBeGreaterThan(0);
        expect(eventEnrollments.length).toBe(1);
        expect(eventEnrollments[0]!.id).toBe(id);
        expect(eventEnrollments[0]!.eventId).toBe("event-1");
        expect(eventEnrollments[0]!.personId).toBe("person-1");
        expect(eventEnrollments[0]!.role).toBe(EnrollmentRole.STAFF);
        expect(eventEnrollments[0]!.createdAt).toBeInstanceOf(Date);
    });

    it("should default to PARTICIPANT role if no valid role is provided", async () => {
        // Arrange
        const repository = new InMemoryEnrollmentRepository();
        const handler = new EnrollPersonCommandHandler(repository);
        const command = new EnrollPersonCommand(
            "event-2",
            "person-2",
            "" // Falsy role should trigger default fallback
        );

        // Act
        const id = await handler.execute(command);
        const personEnrollments = await repository.findByPersonId("person-2");

        // Assert
        expect(id).toBeDefined();
        expect(personEnrollments.length).toBe(1);
        expect(personEnrollments[0]!.id).toBe(id);
        expect(personEnrollments[0]!.eventId).toBe("event-2");
        expect(personEnrollments[0]!.personId).toBe("person-2");
        expect(personEnrollments[0]!.role).toBe(EnrollmentRole.PARTICIPANT);
    });
});
