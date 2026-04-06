import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,
        setupFiles: ["./tests/setup.ts"],
        include: ["tests/**/*.test.ts"],
        env: {
            GOOGLE_CLIENT_ID: "dummy_id",
            GOOGLE_CLIENT_SECRET: "dummy_secret",
            GOOGLE_CALLBACK_URL: "http://localhost:4000/auth/google/callback",
            JWT_SECRET: "test_secret",
            FRONTEND_URL: "http://localhost:5173"
        }
    },
});
