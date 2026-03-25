"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
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
            res.status(500).json({ error: error.message });
        }
    };
    createPaymentMethod = async (req, res) => {
        try {
            const { name, currency } = req.body;
            if (!name || !currency) {
                res.status(400).json({ error: "Name and currency are required" });
                return;
            }
            const id = Math.random().toString(36).substring(2, 9);
            const method = new GlobalConfig_1.PaymentMethod(id, name, currency);
            await this.configRepo.savePaymentMethod(method);
            res.status(201).json({ id, message: "Payment method created successfully" });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    getEventStatuses = async (req, res) => {
        try {
            const statuses = await this.configRepo.getEventStatuses();
            res.status(200).json(statuses);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}
exports.AdminController = AdminController;
//# sourceMappingURL=AdminController.js.map