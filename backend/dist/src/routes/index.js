import { Router } from "express";
import sketchfabRoutes from "./sketchfab.routes.js";
const router = Router();
// Mount all API routes here
router.use("/sketchfab", sketchfabRoutes);
export default router;
