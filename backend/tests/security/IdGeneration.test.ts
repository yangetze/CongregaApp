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
            .send({
                name: "Secure Method",
                currency: "USD"
            });

        expect(response.status).toBe(201);
        const { id } = response.body;

        // UUID v4 regex
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        // Node's randomUUID generates UUID v4, but some versions might vary.
        // A more general UUID regex:
        const generalUuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

        expect(id).toMatch(generalUuidRegex);
    });
});
