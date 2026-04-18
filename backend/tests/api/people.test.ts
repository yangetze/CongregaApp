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

    it("should create a person", async () => {
        const response = await request(app)
            .post("/api/persons")
            .send({
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                organizationId: "org-1",
                documentId: "V-12345678",
                phone: "+1234567890"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.message).toBe("Person created successfully");
    });

    it("should list people for an organization", async () => {
        await request(app)
            .post("/api/persons")
            .send({
                firstName: "John",
                lastName: "Doe",
                email: "john.doe@example.com",
                organizationId: "org-1"
            });

        const response = await request(app).get("/api/persons?organizationId=org-1");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].firstName).toBe("John");
    });

    it("should get a person by documentId", async () => {
        const createRes = await request(app)
            .post("/api/persons")
            .send({
                firstName: "Jane",
                lastName: "Smith",
                email: "jane@example.com",
                organizationId: "org-2",
                documentId: "V-87654321"
            });

        const response = await request(app).get("/api/persons/document/V-87654321?organizationId=org-2");
        expect(response.status).toBe(200);
        expect(response.body.firstName).toBe("Jane");
        expect(response.body.documentId).toBe("V-87654321");
    });

    it("should return 404 if person by documentId is not found", async () => {
        const response = await request(app).get("/api/persons/document/V-000?organizationId=org-2");
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Person not found");
    });

    it("should get enrollments for a person", async () => {
        // Create a person
        const createRes = await request(app)
            .post("/api/persons")
            .send({
                firstName: "Mark",
                lastName: "Twain",
                email: "mark@example.com",
                organizationId: "org-1"
            });
        const personId = createRes.body.id;

        // Note: For now we just test the endpoint responds since we don't have enrollments setup here,
        // we'll setup a proper enrollment in the events test, but we can verify it returns an empty array.
        const response = await request(app).get(`/api/persons/${personId}/enrollments`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });

    it("should return 500 when getPersons query fails with an Error", async () => {
        jest.spyOn(QueryBus.prototype, "execute").mockRejectedValueOnce(new Error("Query failed"));

        const response = await request(app).get("/api/persons?organizationId=org-1");

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Query failed");
    });

    it("should return 500 when getPersons query fails with a non-Error", async () => {
        jest.spyOn(QueryBus.prototype, "execute").mockRejectedValueOnce("Unknown error");

        const response = await request(app).get("/api/persons?organizationId=org-1");

        expect(response.status).toBe(500);
        expect(response.body.error).toBe("An unknown error occurred");
    });

    it("should return 400 when establishRelationship command fails with an Error", async () => {
        jest.spyOn(CommandBus.prototype, "execute").mockRejectedValueOnce(new Error("Relationship failed"));

        const response = await request(app)
            .post("/api/persons/person-1/relationships")
            .send({ relatedPersonId: "person-2", relationshipType: "PARENT" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Relationship failed");
        jest.restoreAllMocks();
    });

    it("should return 400 when establishRelationship command fails with a non-Error", async () => {
        jest.spyOn(CommandBus.prototype, "execute").mockRejectedValueOnce("Unknown error");

        const response = await request(app)
            .post("/api/persons/person-1/relationships")
            .send({ relatedPersonId: "person-2", relationshipType: "PARENT" });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe("An unknown error occurred");
        jest.restoreAllMocks();
    });
});
