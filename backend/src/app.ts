import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import apiRoutes from "./routes/index.js";
import { apiLimiter } from "./middlewares/rateLimit.js";

import path from "path";

const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = (process.env.CORS_ORIGINS || frontendUrl)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true
}));
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

app.get("/health", (_req, res) => {
    const isDatabaseReady = mongoose.connection.readyState === 1;

    res.status(isDatabaseReady ? 200 : 503).json({
        status: isDatabaseReady ? "ok" : "degraded",
        database: isDatabaseReady ? "connected" : "disconnected",
        timestamp: new Date().toISOString()
    });
});

app.get("/login-failed", (_req, res) => res.status(401).json({ error: "Login failed" }));

export default app;
