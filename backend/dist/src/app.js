import express from "express";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import apiRoutes from "./routes/index.js";
import { apiLimiter } from "./middlewares/rateLimit.js";
const app = express();
app.use(express.json());
app.use(passport.initialize());
// Apply rate limiter to all /api routes
app.use("/api", apiLimiter);
// Auth routes: /auth/google, /auth/google/callback, /auth/me
// Must match GOOGLE_CALLBACK_URL in .env
app.use("/auth", authRoutes);
// Mount main API routes
app.use("/api", apiRoutes);
app.get("/login-failed", (_req, res) => res.status(401).json({ error: "Login failed" }));
export default app;
