import request from "supertest";
import { createApp } from "../../src/app";
import { Express } from "express";

describe("Security: Authentication", () => {
    let app: Express;

    beforeEach(() => {
        app = createApp();
    });

    it("should return 401 for POST /api/events without token", async () => {
        const response = await request(app)
            .post("/api/events")
            .send({
                name: "Unauthenticated Event",
                startDate: "2024-07-15T00:00:00Z",
                organizationId: "org-1"
            });

        expect(response.status).toBe(401);
    });

    it("should return 401 for GET /api/events without token", async () => {
        const response = await request(app)
            .get("/api/events");

        expect(response.status).toBe(401);
    });
});
