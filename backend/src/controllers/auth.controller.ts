import { Request, Response } from "express";
import User from "../models/user.model.js";

export class AuthController {
    /**
     * GET /api/me
     * Returns the currently authenticated user
     */
    async getCurrentUser(req: Request, res: Response) {
        try {
            const user = req.user!;

            // Find fresh user details from the database
            const targetUser = await User.findById(user.id).select("-__v");

            if (!targetUser) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({
                id: targetUser.id,
                email: targetUser.email,
                name: targetUser.name,
                avatar: targetUser.avatar,
                role: targetUser.role,
                likedAssets: targetUser.likedAssets,
                purchasedAssets: targetUser.purchasedAssets
            });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     * POST /api/auth/like/:id
     * Toggles an asset in the user's likedAssets
     */
    async toggleLike(req: Request, res: Response) {
        try {
            const user = req.user!;
            const targetUser = await User.findById(user.id);
            if (!targetUser) return res.status(404).json({ error: "User not found" });

            const assetId = req.params.id;
            const index = targetUser.likedAssets.indexOf(assetId);
            
            if (index > -1) {
                targetUser.likedAssets.splice(index, 1);
            } else {
                targetUser.likedAssets.push(assetId);
            }
            
            await targetUser.save();
            
            res.json({
                id: targetUser.id,
                email: targetUser.email,
                name: targetUser.name,
                avatar: targetUser.avatar,
                role: targetUser.role,
                likedAssets: targetUser.likedAssets,
                purchasedAssets: targetUser.purchasedAssets
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    /**
     * POST /api/auth/buy/:id
     * Adds an asset to the user's purchasedAssets
     */
    async purchaseAsset(req: Request, res: Response) {
        try {
            const user = req.user!;
            const targetUser = await User.findById(user.id);
            if (!targetUser) return res.status(404).json({ error: "User not found" });

            const assetId = req.params.id;
            if (!targetUser.purchasedAssets.includes(assetId)) {
                targetUser.purchasedAssets.push(assetId);
                await targetUser.save();
            }
            
            res.json({
                id: targetUser.id,
                email: targetUser.email,
                name: targetUser.name,
                avatar: targetUser.avatar,
                role: targetUser.role,
                likedAssets: targetUser.likedAssets,
                purchasedAssets: targetUser.purchasedAssets
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export const authController = new AuthController();
