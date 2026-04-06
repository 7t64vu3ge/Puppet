import { Request, Response } from "express";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

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

    /**
     * PUT /api/auth/profile
     * Updates the user's name and avatar
     */
    async updateProfile(req: Request, res: Response) {
        try {
            const user = req.user!;
            const { name, avatar } = req.body;

            const targetUser = await User.findById(user.id);
            if (!targetUser) return res.status(404).json({ error: "User not found" });

            if (name) targetUser.name = name;
            if (avatar) targetUser.avatar = avatar;

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
     * POST /api/auth/change-password
     * Placeholder for password change functionality
     */
    async changePassword(req: Request, res: Response) {
        try {
            // Placeholder: Google OAuth users don't have local passwords
            res.json({ message: "Password change request received. Note: Currently, only Google login is supported." });
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * POST /api/auth/become-seller
     * Updates the user's role to 'seller'
     */
    async becomeSeller(req: Request, res: Response) {
        try {
            const user = req.user!;
            const targetUser = await User.findById(user.id);
            if (!targetUser) return res.status(404).json({ error: "User not found" });

            targetUser.role = "seller";
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
     * GET /api/auth/test-session
     * Generates a test JWT for Playwright E2E tests
     * ONLY available in non-production environments
     */
    async getTestSession(req: Request, res: Response) {
        try {
            // Find a test user or create a minimal one
            let testUser = await User.findOne({ email: "test@example.com" });
            if (!testUser) {
                testUser = await User.create({
                    googleId: "test-google-id",
                    email: "test@example.com",
                    name: "Test User",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
                    role: "buyer"
                });
            }

            const token = jwt.sign(
                { id: String(testUser._id), googleId: testUser.googleId, email: testUser.email, role: testUser.role },
                process.env.JWT_SECRET!,
                { expiresIn: "1h" }
            );

            const formattedUser = {
                id: testUser._id || testUser.id,
                email: testUser.email,
                name: testUser.name,
                avatar: testUser.avatar,
                role: testUser.role,
                likedAssets: testUser.likedAssets || [],
                purchasedAssets: testUser.purchasedAssets || []
            };

            const userJson = encodeURIComponent(JSON.stringify(formattedUser));
            const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
            
            // Redirect to frontend with token/user as if coming from Google OAuth
            res.redirect(`${frontendUrl}/?token=${token}&user=${userJson}`);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export const authController = new AuthController();
