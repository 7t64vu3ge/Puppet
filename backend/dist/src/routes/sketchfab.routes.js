import { Router } from "express";
import { sketchfabController } from "../controllers/sketchfab.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = Router();
// Sketchfab routes - protected by requireAuth so only logged in users can search
router.get("/search", requireAuth, sketchfabController.search.bind(sketchfabController));
router.get("/models/:id", requireAuth, sketchfabController.getModel.bind(sketchfabController));
export default router;
