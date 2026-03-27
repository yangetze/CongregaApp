"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
const app = (0, app_1.createApp)();
describe("Person API Integration Tests", () => {
    let orgId = "org-1";
    it("should create a person and calculate age dynamically", async () => {
        const payload = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            organizationId: orgId,
            documentId: "DOC-123",
            phone: "1234567890",
            birthDate: "1990-01-01T00:00:00Z"
        };
        const res = await (0, supertest_1.default)(app).post("/api/persons").send(payload);
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        const getRes = await (0, supertest_1.default)(app).get(`/api/persons/document/DOC-123?organizationId=${orgId}`);
        expect(getRes.status).toBe(200);
        expect(getRes.body.firstName).toBe("John");
        expect(getRes.body.age).toBeGreaterThanOrEqual(30); // dynamic age test
    });
    it("should silently return existing id when duplicate documentId is created in the same org", async () => {
        const payload = {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            organizationId: orgId,
            documentId: "DOC-456",
            birthDate: "1995-05-05T00:00:00Z"
        };
        const res1 = await (0, supertest_1.default)(app).post("/api/persons").send(payload);
        expect(res1.status).toBe(201);
        const firstId = res1.body.id;
        const payloadDuplicate = {
            firstName: "Jane",
            lastName: "Smith-Doe",
            email: "jane.smith2@example.com",
            organizationId: orgId,
            documentId: "DOC-456",
            birthDate: "1995-05-05T00:00:00Z"
        };
        const res2 = await (0, supertest_1.default)(app).post("/api/persons").send(payloadDuplicate);
        expect(res2.status).toBe(201);
        expect(res2.body.id).toBe(firstId); // same id returned
    });
    it("should search and filter directory", async () => {
        // We know Jane and John are created from previous tests
        const resList = await (0, supertest_1.default)(app).get(`/api/persons?organizationId=${orgId}&search=john`);
        expect(resList.status).toBe(200);
        expect(resList.body.length).toBe(1);
        expect(resList.body[0].firstName).toBe("John");
        const resListEmpty = await (0, supertest_1.default)(app).get(`/api/persons?organizationId=${orgId}&search=nonexistent`);
        expect(resListEmpty.status).toBe(200);
        expect(resListEmpty.body.length).toBe(0);
    });
    it("should establish bidirectional relationships and reject self-relation", async () => {
        const payload1 = {
            firstName: "Parent",
            lastName: "Test",
            email: "parent@example.com",
            organizationId: orgId,
            documentId: "DOC-PARENT"
        };
        const res1 = await (0, supertest_1.default)(app).post("/api/persons").send(payload1);
        const parentId = res1.body.id;
        const payload2 = {
            firstName: "Child",
            lastName: "Test",
            email: "child@example.com",
            organizationId: orgId,
            documentId: "DOC-CHILD"
        };
        const res2 = await (0, supertest_1.default)(app).post("/api/persons").send(payload2);
        const childId = res2.body.id;
        // Establish relationship PARENT -> CHILD
        const relRes = await (0, supertest_1.default)(app).post(`/api/persons/${parentId}/relationships`).send({
            relatedPersonId: childId,
            relationshipType: "PARENT"
        });
        expect(relRes.status).toBe(201);
        // Try self-relation
        const selfRelRes = await (0, supertest_1.default)(app).post(`/api/persons/${parentId}/relationships`).send({
            relatedPersonId: parentId,
            relationshipType: "SIBLING"
        });
        expect(selfRelRes.status).toBe(400);
        expect(selfRelRes.body.error).toBe("Cannot establish a relationship with oneself");
    });
});
//# sourceMappingURL=person.test.js.map