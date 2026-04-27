"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const node_crypto_1 = require("node:crypto");
const GlobalConfig_1 = require("../../../domain/admin/GlobalConfig");
const errorHandler_1 = require("../../utils/errorHandler");
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
            (0, errorHandler_1.handleControllerError)(res, error);
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
            (0, errorHandler_1.handleControllerError)(res, error);
        }
    };
    getEventStatuses = async (req, res) => {
        try {
            const statuses = await this.configRepo.getEventStatuses();
            res.status(200).json(statuses);
        }
        catch (error) {
            (0, errorHandler_1.handleControllerError)(res, error);
        }
    };
}
exports.AdminController = AdminController;
//# sourceMappingURL=AdminController.js.map