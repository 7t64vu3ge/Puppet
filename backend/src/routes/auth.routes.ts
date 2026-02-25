import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent" // Forces account selection so "different" accounts can log in
}));

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }),
    (req, res) => {
        const user = req.user as any;
        const token = jwt.sign({ googleId: user.googleId, email: user.email }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        // Format user output identically to the /api/me route
        const formattedUser = {
            id: user._id || user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: user.role
        };

        res.json({ token, user: formattedUser });
    }
);

export default router;