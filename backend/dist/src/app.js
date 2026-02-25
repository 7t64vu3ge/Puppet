import express from "express";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import { requireAuth } from "./middlewares/auth.middleware.js";
import User from "./models/user.model.js";
const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.get("/login-failed", (_req, res) => res.status(401).json({ error: "Login failed" }));
// Protected Route Example
app.get("/api/me", requireAuth, async (req, res) => {
    try {
        const decodedUser = req.user;
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
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});
export default app;
