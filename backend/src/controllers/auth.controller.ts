import { Request, Response } from "express";
import User from "../models/user.model.js";

export class AuthController {
    /**
     * GET /api/me
     * Returns the currently authenticated user
     */
    async getCurrentUser(req: Request, res: Response) {
        try {
            const decodedUser = (req as any).user;

            // Find fresh user details from the database
            const targetUser = await User.findOne({ email: decodedUser.email }).select("-__v");

            if (!targetUser) {
                return res.status(404).json({ error: "User not found" });
            }

            res.json({
                id: targetUser.id,
                email: targetUser.email,
                name: targetUser.name,
                avatar: targetUser.avatar,
                role: targetUser.role
            });
        } catch (error) {
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export const authController = new AuthController();
