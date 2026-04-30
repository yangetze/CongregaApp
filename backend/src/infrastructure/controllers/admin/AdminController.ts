import { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { PaymentMethod } from "../../../domain/admin/GlobalConfig";
import { IGlobalConfigRepository } from "../../../infrastructure/repositories/admin/InMemoryGlobalConfigRepository";
import { handleControllerError } from "../../utils/errorHandler";

export class AdminController {
    constructor(private readonly configRepo: IGlobalConfigRepository) {}

    getPaymentMethods = async (req: Request, res: Response): Promise<void> => {
        try {
            const methods = await this.configRepo.getPaymentMethods();
            res.status(200).json(methods);
        } catch (error: unknown) {
            handleControllerError(res, error);
        }
    };

    createPaymentMethod = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, currency } = req.body;
            if (!name || !currency) {
                res.status(400).json({ error: "Name and currency are required" });
                return;
            }
            const id = randomUUID();
            const method = new PaymentMethod(id, name, currency);
            await this.configRepo.savePaymentMethod(method);
            res.status(201).json({ id, message: "Payment method created successfully" });
        } catch (error: unknown) {
            handleControllerError(res, error);
        }
    };

    getEventStatuses = async (req: Request, res: Response): Promise<void> => {
        try {
            const statuses = await this.configRepo.getEventStatuses();
            res.status(200).json(statuses);
        } catch (error: unknown) {
            handleControllerError(res, error);
        }
    };
}
