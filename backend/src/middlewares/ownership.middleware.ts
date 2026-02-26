import { Request, Response, NextFunction } from "express";
import Asset, { IAsset } from "../models/asset.model.js";

// Extend Express Request to carry a pre-loaded asset
declare global {
    namespace Express {
        interface Request {
            asset?: IAsset;
        }
    }
}

/**
 * Middleware that:
 *  1. Loads the Asset by req.params.id
 *  2. Returns 404 if not found
 *  3. Returns 403 if req.user is neither the owner nor an admin
 *  4. Attaches the asset to req.asset for downstream handlers
 *
 * Must be used AFTER requireAuth.
 */
export const requireOwnerOrAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const asset = await Asset.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({ error: "Asset not found" });
        }

        const user = req.user!;

        const isOwner = asset.ownerId.toString() === user.id;
        const isAdmin = user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                error: "Forbidden: You do not own this asset",
            });
        }

        req.asset = asset;
        next();
    } catch {
        return res.status(400).json({ error: "Invalid asset ID" });
    }
};
