import { Response } from "express";

export const handleControllerError = (res: Response, error: unknown, statusCode: number = 500): void => {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    res.status(statusCode).json({ error: errorMessage });
};
