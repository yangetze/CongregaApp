"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
describe("Events API", () => {
    let app;
    beforeEach(() => {
        app = (0, app_1.createApp)();
    });
    it("should create an event", async () => {
        const response = await (0, supertest_1.default)(app)
            .post("/api/events")
            .send({
            name: "Summer Camp 2024",
            startDate: "2024-07-15T00:00:00Z",
            endDate: "2024-07-20T00:00:00Z",
            totalCapacity: 150,
            organizationId: "org-1",
            hasCost: true,
            requirements: { targetGender: "ANY", minAge: 18 },
            costs: [
                { name: "Base Cost", amount: 100.00, isRequired: true }
            ],
            tickets: [
                { name: "General", quantity: 150, price: 100 }
            ],
            statusId: "status-draft"
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.message).toBe("Event created successfully");
    });
    it("should list events for an organization", async () => {
        await (0, supertest_1.default)(app)
            .post("/api/events")
            .send({
            name: "Retreat 2024",
            startDate: "2024-08-15T00:00:00Z",
            endDate: "2024-08-20T00:00:00Z",
            totalCapacity: 50,
            organizationId: "org-1"
        });
        const response = await (0, supertest_1.default)(app).get("/api/events?organizationId=org-1");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe("Retreat 2024");
    });
    it("should create an event and enroll organizers and participants", async () => {
        // Create an organizer
        const createOrganizerRes = await (0, supertest_1.default)(app)
            .post("/api/persons")
            .send({
            firstName: "John",
            lastName: "Organizer",
            email: "john.org@example.com",
            organizationId: "org-1"
        });
        const organizerId = createOrganizerRes.body.id;
        // Create a participant
        const createParticipantRes = await (0, supertest_1.default)(app)
            .post("/api/persons")
            .send({
            firstName: "Jane",
            lastName: "Participant",
            email: "jane.part@example.com",
            organizationId: "org-1"
        });
        const participantId = createParticipantRes.body.id;
        // Create Event with automatic enrollment
        const createEventRes = await (0, supertest_1.default)(app)
            .post("/api/events")
            .send({
            name: "Seminar 2024",
            startDate: "2024-09-15T00:00:00Z",
            endDate: "2024-09-20T00:00:00Z",
            totalCapacity: 100,
            organizationId: "org-1",
            organizers: [organizerId],
            participants: [participantId]
        });
        expect(createEventRes.status).toBe(201);
        const eventId = createEventRes.body.id;
        // Now verify the enrollments exist for the organizer
        const orgEnrollmentsRes = await (0, supertest_1.default)(app).get(`/api/persons/${organizerId}/enrollments`);
        expect(orgEnrollmentsRes.status).toBe(200);
        expect(orgEnrollmentsRes.body.length).toBe(1);
        expect(orgEnrollmentsRes.body[0].eventId).toBe(eventId);
        expect(orgEnrollmentsRes.body[0].role).toBe("STAFF");
        // Verify the enrollments exist for the participant
        const partEnrollmentsRes = await (0, supertest_1.default)(app).get(`/api/persons/${participantId}/enrollments`);
        expect(partEnrollmentsRes.status).toBe(200);
        expect(partEnrollmentsRes.body.length).toBe(1);
        expect(partEnrollmentsRes.body[0].eventId).toBe(eventId);
        expect(partEnrollmentsRes.body[0].role).toBe("PARTICIPANT");
    });
    it("should manually enroll a person into an event", async () => {
        // Create an event
        const createEventRes = await (0, supertest_1.default)(app)
            .post("/api/events")
            .send({
            name: "Workshop 2024",
            startDate: "2024-10-15T00:00:00Z",
            endDate: "2024-10-20T00:00:00Z",
            totalCapacity: 30,
            organizationId: "org-2"
        });
        const eventId = createEventRes.body.id;
        // Create a person
        const createPersonRes = await (0, supertest_1.default)(app)
            .post("/api/persons")
            .send({
            firstName: "Alice",
            lastName: "Student",
            email: "alice@example.com",
            organizationId: "org-2"
        });
        const personId = createPersonRes.body.id;
        // Enroll person
        const enrollRes = await (0, supertest_1.default)(app)
            .post(`/api/events/${eventId}/enroll`)
            .send({
            personId: personId,
            role: "ATTENDEE"
        });
        expect(enrollRes.status).toBe(201);
        expect(enrollRes.body.message).toBe("Person enrolled successfully");
        // Verify enrollment
        const enrollmentsRes = await (0, supertest_1.default)(app).get(`/api/persons/${personId}/enrollments`);
        expect(enrollmentsRes.status).toBe(200);
        expect(enrollmentsRes.body.length).toBe(1);
        expect(enrollmentsRes.body[0].eventId).toBe(eventId);
        expect(enrollmentsRes.body[0].role).toBe("ATTENDEE");
    });
});
//# sourceMappingURL=events.test.js.map