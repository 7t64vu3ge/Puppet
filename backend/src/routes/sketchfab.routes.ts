import { Router } from "express";
import { sketchfabController } from "../controllers/sketchfab.controller.js";

const router = Router();

// Sketchfab routes - public so frontend can load assets without auth
router.get("/search", sketchfabController.search.bind(sketchfabController));
router.get("/models/:id", sketchfabController.getModel.bind(sketchfabController));
router.get("/models/:id/download", sketchfabController.getDownload.bind(sketchfabController));

export default router;
