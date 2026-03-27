"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../src/app");
describe("Admin Global API", () => {
    let app;
    beforeEach(() => {
        app = (0, app_1.createApp)();
    });
    it("should retrieve default payment methods", async () => {
        const response = await (0, supertest_1.default)(app).get("/api/admin/payment-methods");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // By default InMemoryGlobalConfigRepository has Zelle and Binance
        expect(response.body.length).toBeGreaterThanOrEqual(2);
        expect(response.body[0].name).toBe("Zelle");
    });
    it("should create a new payment method", async () => {
        const createRes = await (0, supertest_1.default)(app)
            .post("/api/admin/payment-methods")
            .send({
            name: "PayPal",
            currency: "USD"
        });
        expect(createRes.status).toBe(201);
        expect(createRes.body).toHaveProperty("id");
        expect(createRes.body.message).toBe("Payment method created successfully");
        // Verify it was added
        const getRes = await (0, supertest_1.default)(app).get("/api/admin/payment-methods");
        expect(getRes.status).toBe(200);
        const methods = getRes.body;
        const paypal = methods.find((m) => m.name === "PayPal" && m.currency === "USD");
        expect(paypal).toBeDefined();
    });
    it("should return 400 when creating payment method without required fields", async () => {
        const response = await (0, supertest_1.default)(app)
            .post("/api/admin/payment-methods")
            .send({
            name: "Stripe"
            // Missing currency
        });
        expect(response.status).toBe(400);
        expect(response.body.error).toBe("Name and currency are required");
    });
    it("should retrieve default event statuses", async () => {
        const response = await (0, supertest_1.default)(app).get("/api/admin/event-statuses");
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        // By default InMemoryGlobalConfigRepository has Borrador, Activo, etc.
        expect(response.body.length).toBeGreaterThanOrEqual(4);
        expect(response.body[0].name).toBe("Borrador");
        expect(response.body[1].name).toBe("Activo");
    });
});
//# sourceMappingURL=admin.test.js.map