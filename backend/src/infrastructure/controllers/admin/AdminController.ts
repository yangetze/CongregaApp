import { Request, Response } from "express";
import { PaymentMethod } from "../../../domain/admin/GlobalConfig";
import { IGlobalConfigRepository } from "../../../infrastructure/repositories/admin/InMemoryGlobalConfigRepository";

export class AdminController {
    constructor(private readonly configRepo: IGlobalConfigRepository) {}

    getPaymentMethods = async (req: Request, res: Response): Promise<void> => {
        try {
            const methods = await this.configRepo.getPaymentMethods();
            res.status(200).json(methods);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    createPaymentMethod = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, currency } = req.body;
            if (!name || !currency) {
                res.status(400).json({ error: "Name and currency are required" });
                return;
            }
            const id = Math.random().toString(36).substring(2, 9);
            const method = new PaymentMethod(id, name, currency);
            await this.configRepo.savePaymentMethod(method);
            res.status(201).json({ id, message: "Payment method created successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    getEventStatuses = async (req: Request, res: Response): Promise<void> => {
        try {
            const statuses = await this.configRepo.getEventStatuses();
            res.status(200).json(statuses);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
