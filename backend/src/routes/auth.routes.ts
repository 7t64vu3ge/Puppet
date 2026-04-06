import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { authController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Test-only route for E2E automation
if (process.env.NODE_ENV !== 'production') {
    router.get("/test-session", authController.getTestSession.bind(authController));
}

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent" // Forces account selection so "different" accounts can log in
}));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
    (req, res) => {
        const user = req.user as any;
        const token = jwt.sign(
            { id: String(user._id), googleId: user.googleId, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        // Format user output identically to the /api/me route
        const formattedUser = {
            id: user._id || user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
            likedAssets: user.likedAssets || [],
            purchasedAssets: user.purchasedAssets || []
        };

        const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
        const userJson = encodeURIComponent(JSON.stringify(formattedUser));
        res.redirect(`${frontendUrl}/?token=${token}&user=${userJson}`);
    }
);

// Protected routes
router.get("/me", requireAuth, authController.getCurrentUser.bind(authController));
router.put("/profile", requireAuth, authController.updateProfile.bind(authController));
router.post("/change-password", requireAuth, authController.changePassword.bind(authController));
router.post("/become-seller", requireAuth, authController.becomeSeller.bind(authController));
router.post("/like/:id", requireAuth, authController.toggleLike.bind(authController));
router.post("/buy/:id", requireAuth, authController.purchaseAsset.bind(authController));

export default router;