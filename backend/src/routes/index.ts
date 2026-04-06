import { Router } from "express";
import sketchfabRoutes from "./sketchfab.routes.js";
import assetRoutes from "./asset.routes.js";
import { marketplaceController } from "../controllers/marketplace.controller.js";

const router = Router();

// Mount all API routes here
router.get("/marketplace", marketplaceController.search.bind(marketplaceController));
router.use("/sketchfab", sketchfabRoutes);
router.use("/assets", assetRoutes);

export default router;

