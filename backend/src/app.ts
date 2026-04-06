import express from "express";
import cors from "cors";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import apiRoutes from "./routes/index.js";
import { apiLimiter } from "./middlewares/rateLimit.js";

import path from "path";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Serve uploaded files statically
app.use("/uploads", express.static(path.resolve("uploads")));

// Apply rate limiter to all /api routes
app.use("/api", apiLimiter);

// Auth routes: /auth/google, /auth/google/callback, /auth/me
// Must match GOOGLE_CALLBACK_URL in .env
app.use("/auth", authRoutes);

// Mount main API routes
app.use("/api", apiRoutes);

app.get("/login-failed", (_req, res) => res.status(401).json({ error: "Login failed" }));

export default app;