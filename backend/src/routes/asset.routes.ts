import { Router } from "express";
import { assetController } from "../controllers/asset.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { requireOwnerOrAdmin } from "../middlewares/ownership.middleware.js";

const router = Router();

/**
 * POST /api/assets
 * Protected: must be authenticated AND have role seller or admin
 */
router.post(
    "/",
    requireAuth,
    requireRole("seller", "admin"),
    assetController.createAsset.bind(assetController)
);

/**
 * GET /api/assets
 * Public — paginated list with optional ?search=<title>
 */
router.get("/", assetController.getAssets.bind(assetController));

/**
 * GET /api/assets/:id
 * Public — single asset detail
 */
router.get("/:id", assetController.getAssetById.bind(assetController));

/**
 * PUT /api/assets/:id
 * Protected: must be owner or admin
 * requireOwnerOrAdmin also loads req.asset to avoid a second DB hit in the controller
 */
router.put(
    "/:id",
    requireAuth,
    requireOwnerOrAdmin,
    assetController.updateAsset.bind(assetController)
);

/**
 * DELETE /api/assets/:id
 * Protected: must be owner or admin
 */
router.delete(
    "/:id",
    requireAuth,
    requireOwnerOrAdmin,
    assetController.deleteAsset.bind(assetController)
);

export default router;
