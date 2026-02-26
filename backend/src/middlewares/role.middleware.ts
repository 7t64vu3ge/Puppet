import { Request, Response, NextFunction } from "express";
import { AuthPayload } from "./auth.middleware.js";

type Role = AuthPayload["role"];

/**
 * Middleware factory — only allows users whose role is in the allowed list.
 * Must be used AFTER requireAuth so that req.user is populated.
 *
 * Example:
 *   router.post("/assets", requireAuth, requireRole("seller", "admin"), ...)
 */
export const requireRole = (...allowed: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: "Unauthorized: Not authenticated" });
        }

        if (!allowed.includes(user.role)) {
            return res.status(403).json({
                error: `Forbidden: requires role ${allowed.join(" or ")}`,
            });
        }

        next();
    };
};
