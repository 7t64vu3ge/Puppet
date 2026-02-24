import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
const router = Router();
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login-failed" }), (req, res) => {
    const user = req.user;
    const token = jwt.sign({ googleId: user.googleId, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    res.json({ token, user });
});
export default router;
