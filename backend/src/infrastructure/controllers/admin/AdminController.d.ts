import { Request, Response } from "express";
import { IGlobalConfigRepository } from "../../../infrastructure/repositories/admin/InMemoryGlobalConfigRepository";
export declare class AdminController {
    private readonly configRepo;
    constructor(configRepo: IGlobalConfigRepository);
    getPaymentMethods: (req: Request, res: Response) => Promise<void>;
    createPaymentMethod: (req: Request, res: Response) => Promise<void>;
    getEventStatuses: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=AdminController.d.ts.map