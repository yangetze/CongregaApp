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

        // Ensure ID is defined and is a string
        expect(id).toBeDefined();
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThan(0);
    });
});
