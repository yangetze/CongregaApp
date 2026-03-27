"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const node_crypto_1 = require("node:crypto");
const GlobalConfig_1 = require("../../../domain/admin/GlobalConfig");
class AdminController {
    configRepo;
    constructor(configRepo) {
        this.configRepo = configRepo;
    }
    getPaymentMethods = async (req, res) => {
        try {
            const methods = await this.configRepo.getPaymentMethods();
            res.status(200).json(methods);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };
    createPaymentMethod = async (req, res) => {
        try {
            const { name, currency } = req.body;
            if (!name || !currency) {
                res.status(400).json({ error: "Name and currency are required" });
                return;
            }
            const id = (0, node_crypto_1.randomUUID)();
            const method = new GlobalConfig_1.PaymentMethod(id, name, currency);
            await this.configRepo.savePaymentMethod(method);
            res.status(201).json({ id, message: "Payment method created successfully" });
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };
    getEventStatuses = async (req, res) => {
        try {
            const statuses = await this.configRepo.getEventStatuses();
            res.status(200).json(statuses);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            res.status(500).json({ error: errorMessage });
        }
    };
}
exports.AdminController = AdminController;
//# sourceMappingURL=AdminController.js.map