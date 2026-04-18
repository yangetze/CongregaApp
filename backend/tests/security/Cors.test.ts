import request from "supertest";
import { createApp } from "../../src/app";
import { Express } from "express";

describe("CORS Policy Security", () => {
    let app: Express;

    beforeEach(() => {
        app = createApp();
    });

    it("should allow requests from the default trusted origin", async () => {
        const response = await request(app)
            .options("/")
            .set("Origin", "http://localhost:5173")
            .set("Access-Control-Request-Method", "GET");

        expect(response.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
    });

    it("should block requests from untrusted origins", async () => {
        const response = await request(app)
            .options("/")
            .set("Origin", "http://malicious-site.com")
            .set("Access-Control-Request-Method", "GET");

        expect(response.headers["access-control-allow-origin"]).toBeUndefined();
    });

    it("should allow requests with no origin (e.g., same-origin or curl)", async () => {
        const response = await request(app).get("/");
        expect(response.status).toBe(200);
    });
});
