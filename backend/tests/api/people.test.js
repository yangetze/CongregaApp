"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
describe("People API", () => {
    let app;
    beforeEach(() => {
        app = (0, app_1.createApp)();
    });
    it("should create a person", async () => {
        const response = await (0, supertest_1.default)(app)
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
        await (0, supertest_1.default)(app)
            .post("/api/persons")
            .send({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            organizationId: "org-1"
        });
        const response = await (0, supertest_1.default)(app).get("/api/persons?organizationId=org-1");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0].firstName).toBe("John");
    });
    it("should get a person by documentId", async () => {
        const createRes = await (0, supertest_1.default)(app)
            .post("/api/persons")
            .send({
            firstName: "Jane",
            lastName: "Smith",
            email: "jane@example.com",
            organizationId: "org-2",
            documentId: "V-87654321"
        });
        const response = await (0, supertest_1.default)(app).get("/api/persons/document/V-87654321?organizationId=org-2");
        expect(response.status).toBe(200);
        expect(response.body.firstName).toBe("Jane");
        expect(response.body.documentId).toBe("V-87654321");
    });
    it("should return 404 if person by documentId is not found", async () => {
        const response = await (0, supertest_1.default)(app).get("/api/persons/document/V-000?organizationId=org-2");
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Person not found");
    });
    it("should get enrollments for a person", async () => {
        // Create a person
        const createRes = await (0, supertest_1.default)(app)
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
        const response = await (0, supertest_1.default)(app).get(`/api/persons/${personId}/enrollments`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });
});
//# sourceMappingURL=people.test.js.map