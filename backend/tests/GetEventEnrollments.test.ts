import { GetEventEnrollmentsQuery, GetEventEnrollmentsQueryHandler } from "../src/application/queries/GetEventEnrollments";
import { Enrollment, EnrollmentRole } from "../src/domain/Event";

describe("GetEventEnrollmentsQueryHandler", () => {
    it("should return enrollments for a given eventId", async () => {
        // Arrange
        const eventId = "event-123";
        const mockEnrollments: Enrollment[] = [
            new Enrollment("enr-1", eventId, "person-1", EnrollmentRole.PARTICIPANT),
            new Enrollment("enr-2", eventId, "person-2", EnrollmentRole.STAFF)
        ];

        const mockRepository = {
            findByEventId: jest.fn().mockResolvedValue(mockEnrollments)
        };

        const handler = new GetEventEnrollmentsQueryHandler(mockRepository as any);
        const query = new GetEventEnrollmentsQuery(eventId);

        // Act
        const result = await handler.execute(query);

        // Assert
        expect(mockRepository.findByEventId).toHaveBeenCalledWith(eventId);
        expect(result).toEqual(mockEnrollments);
        expect(result.length).toBe(2);
    });

    it("should return an empty array if no enrollments are found", async () => {
        // Arrange
        const eventId = "event-456";
        const mockRepository = {
            findByEventId: jest.fn().mockResolvedValue([])
        };

        const handler = new GetEventEnrollmentsQueryHandler(mockRepository as any);
        const query = new GetEventEnrollmentsQuery(eventId);

        // Act
        const result = await handler.execute(query);

        // Assert
        expect(mockRepository.findByEventId).toHaveBeenCalledWith(eventId);
        expect(result).toEqual([]);
        expect(result.length).toBe(0);
    });
});
