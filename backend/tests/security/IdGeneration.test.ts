import request from "supertest";
import { createApp } from "../../src/app";
import { Express } from "express";

describe("Security: ID Generation", () => {
    let app: Express;

    beforeEach(() => {
        app = createApp();
    });

    it("should generate a valid UUID for a new payment method", async () => {
        const response = await request(app)
            .post("/api/admin/payment-methods")
            .set("Authorization", "Bearer mock-token")
            .send({
                name: "Crypto",
                currency: "USDT"
            });

        expect(response.status).toBe(201);
        const { id } = response.body;

        // Ensure ID is defined and is a string
        expect(id).toBeDefined();
        expect(typeof id).toBe("string");

        // UUID regex pattern (v4 or general UUID)
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        expect(id).toMatch(uuidRegex);
    });

    it("should generate a valid UUID for a new event", async () => {
        const response = await request(app)
            .post("/api/events")
            .set("Authorization", "Bearer mock-token")
            .send({
                name: "Test Event ID",
                startDate: "2024-01-01T00:00:00Z",
                endDate: "2024-01-02T00:00:00Z",
                totalCapacity: 100,
                organizationId: "org-sec-1",
                hasCost: false
            });

        expect(response.status).toBe(201);
        const { id } = response.body;

        expect(id).toBeDefined();
        expect(typeof id).toBe("string");

        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        expect(id).toMatch(uuidRegex);
    });
});
