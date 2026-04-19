import { Request, Response, NextFunction } from "express";

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== "Bearer mock-token") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
};
