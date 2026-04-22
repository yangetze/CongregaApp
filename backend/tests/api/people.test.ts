import request from "supertest";
import { createApp } from "../../src/app";
import { Express } from "express";
import { QueryBus } from "../../src/shared/cqrs/QueryBus";
import { CommandBus } from "../../src/shared/cqrs/CommandBus";

describe("People API", () => {
    let app: Express;

    beforeEach(() => {
        app = createApp();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should return 401 when missing Authorization header", async () => {
        const response = await request(app).get("/api/persons?organizationId=org-1");
        expect(response.status).toBe(401);
    });

    it("should return 403 when Authorization header is invalid", async () => {
        const response = await request(app)
            .get("/api/persons?organizationId=org-1")
            .set("Authorization", "Bearer invalid-token");
        expect(response.status).toBe(403);
    });

    it("should create a new person", async () => {
        const response = await request(app)
            .post("/api/persons")
            .set("Authorization", "Bearer mock-token")
            .send({
                documentId: "V-12345678",
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                phone: "+1234567890",
                birthDate: "1990-01-01T00:00:00Z",
                organizationId: "org-1"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.message).toBe("Person created successfully");
    });

    it("should list persons for an organization", async () => {
        // Create first person
        await request(app)
            .post("/api/persons")
            .set("Authorization", "Bearer mock-token")
            .send({
                firstName: "Alice",
                lastName: "Smith",
                organizationId: "org-2"
            });

        // Fetch
        const response = await request(app)
            .get("/api/persons?organizationId=org-2")
            .set("Authorization", "Bearer mock-token");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].firstName).toBe("Alice");
    });

    it("should return 400 when fetching persons without organizationId", async () => {
        const response = await request(app)
            .get("/api/persons")
            .set("Authorization", "Bearer mock-token");
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("organizationId is required");
    });

    it("should get a person by documentId", async () => {
        await request(app)
            .post("/api/persons")
            .set("Authorization", "Bearer mock-token")
            .send({
                documentId: "E-87654321",
                firstName: "Bob",
                lastName: "Builder",
                organizationId: "org-1"
            });

        const response = await request(app)
            .get("/api/persons/document/E-87654321?organizationId=org-1")
            .set("Authorization", "Bearer mock-token");

        expect(response.status).toBe(200);
        expect(response.body.firstName).toBe("Bob");
    });

    it("should return 404 if person by documentId is not found", async () => {
        const response = await request(app)
            .get("/api/persons/document/V-000?organizationId=org-2")
            .set("Authorization", "Bearer mock-token");
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Person not found");
    });

    it("should get enrollments for a person", async () => {
        // Create person
        const createRes = await request(app)
            .post("/api/persons")
            .set("Authorization", "Bearer mock-token")
            .send({
                firstName: "Charlie",
                lastName: "Chaplin",
                organizationId: "org-3"
            });
        const personId = createRes.body.id;

        // we'll setup a proper enrollment in the events test, but we can verify it returns an empty array.
        const response = await request(app)
            .get(`/api/persons/${personId}/enrollments`)
            .set("Authorization", "Bearer mock-token");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });

    it("should return 500 when getPersons query fails with an Error", async () => {
        jest.spyOn(QueryBus.prototype, "execute").mockRejectedValue(new Error("Query failed"));

        const response = await request(app)
            .get("/api/persons?organizationId=org-1")
            .set("Authorization", "Bearer mock-token");

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Query failed");
    });

    it("should return 500 when getPersons query fails with a non-Error", async () => {
        jest.spyOn(QueryBus.prototype, "execute").mockRejectedValue("String error");

        const response = await request(app)
            .get("/api/persons?organizationId=org-1")
            .set("Authorization", "Bearer mock-token");

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("An unknown error occurred");
    });

    it("should return 400 when establishRelationship command fails with an Error", async () => {
        jest.spyOn(CommandBus.prototype, "execute").mockRejectedValue(new Error("Relationship failed"));

        const response = await request(app)
            .post("/api/persons/person-1/relationships")
            .set("Authorization", "Bearer mock-token")
            .send({ relatedPersonId: "person-2", relationshipType: "PARENT" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Relationship failed");
    });

    it("should return 400 when establishRelationship command fails with a non-Error", async () => {
        jest.spyOn(CommandBus.prototype, "execute").mockRejectedValue("String error");

        const response = await request(app)
            .post("/api/persons/person-1/relationships")
            .set("Authorization", "Bearer mock-token")
            .send({ relatedPersonId: "person-2", relationshipType: "PARENT" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("An unknown error occurred");
    });
});
