import type { NextFunction, Request, Response } from "express";
import { config } from "../config";

/**
 * Middleware to verify internal API key for server-to-server communication.
 * Used for endpoints that should only be accessible from trusted services (e.g., NextAuth).
 */
export const requireInternalKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers["x-internal-api-key"];

  if (apiKey !== config.INTERNAL_API_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  next();
};
