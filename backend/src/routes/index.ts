import { Router } from "express";
import sketchfabRoutes from "./sketchfab.routes.js";
import assetRoutes from "./asset.routes.js";

const router = Router();

// Mount all API routes here
router.use("/sketchfab", sketchfabRoutes);
router.use("/assets", assetRoutes);

export default router;

