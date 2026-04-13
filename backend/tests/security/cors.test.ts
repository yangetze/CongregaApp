import request from "supertest";
import { createApp } from "../../src/app";

describe("CORS Security Tests", () => {
    let app: any;

    beforeAll(() => {
        app = createApp();
    });

    afterEach(() => {
        jest.resetModules();
    });

    it("should allow requests from the default trusted origin", async () => {
        // By default, if CORS_ORIGIN is not set, it should allow http://localhost:5173
        const response = await request(app)
            .get("/")
            .set("Origin", "http://localhost:5173");

        expect(response.headers["access-control-allow-origin"]).toEqual("http://localhost:5173");
    });

    it("should not include CORS headers for an unauthorized origin", async () => {
        const response = await request(app)
            .get("/")
            .set("Origin", "http://malicious-website.com");

        // When cors origin is specified as a string, it returns that string.
        // We verify that it does NOT reflect the malicious origin
        expect(response.headers["access-control-allow-origin"]).not.toEqual("http://malicious-website.com");
    });

    it("should allow requests from a custom configured origin", async () => {
        // Set custom environment variable
        process.env.CORS_ORIGIN = "https://trusted-domain.com";

        // Create a new app instance to pick up the new env var
        const customApp = createApp();

        const response = await request(customApp)
            .get("/")
            .set("Origin", "https://trusted-domain.com");

        expect(response.headers["access-control-allow-origin"]).toEqual("https://trusted-domain.com");

        // Clean up
        delete process.env.CORS_ORIGIN;
    });
});
