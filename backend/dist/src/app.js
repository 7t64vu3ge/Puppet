import express from "express";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
const app = express();
app.use(express.json());
app.use(passport.initialize());
app.use("/auth", authRoutes);
app.get("/login-failed", (_req, res) => res.status(401).json({ error: "Login failed" }));
export default app;
