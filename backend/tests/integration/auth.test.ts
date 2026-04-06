import { describe, it, expect, vi } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import jwt from "jsonwebtoken";
import User from "../../src/models/user.model.js";

// Mock JWT secret for tests
process.env.JWT_SECRET = "test_secret";

describe("Auth Integration Tests", () => {
    it("should return 401 if No token is provided to /auth/me", async () => {
        const res = await request(app).get("/auth/me");
        expect(res.status).toBe(401);
        expect(res.body.error).toContain("No token provided");
    });

    it("should return 200 and user data with valid JWT", async () => {
        // 1. Create a test user in the in-memory DB
        const testUser = await User.create({
            googleId: "12345",
            email: "test@example.com",
            name: "Test User",
            avatar: "http://example.com/avatar.png",
            role: "buyer"
        });

        // 2. Generate a valid JWT for this user
        const token = jwt.sign(
            { id: String(testUser._id), googleId: testUser.googleId, email: testUser.email, role: testUser.role },
            process.env.JWT_SECRET!,
            { expiresIn: "1h" }
        );

        // 3. Request /auth/me with the token
        const res = await request(app)
            .get("/auth/me")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe("test@example.com");
        expect(res.body.name).toBe("Test User");
    });

    it("should return 401 for an invalid JWT", async () => {
        const res = await request(app)
            .get("/auth/me")
            .set("Authorization", "Bearer invalid_token");

        expect(res.status).toBe(401);
        expect(res.body.error).toContain("Invalid token");
    });
});
