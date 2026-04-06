import { Request, Response } from "express";
import { sketchfabService } from "../services/sketchfab.service.js";
import { apiCache } from "../utils/cache.js";

export class SketchfabController {
    /**
     * GET /api/sketchfab/search
     * Expects a query parameter `q`
     */
    /**
     * GET /api/sketchfab/search
     * Expects query parameters `q` (optional) and `cursor` (optional)
     */
    async search(req: Request, res: Response) {
        try {
            const query = (req.query.q as string) || "";
            const cursor = req.query.cursor as string;

            const cacheKey = `sketchfab_search_${query || "trending"}_${cursor || "first"}`;

            // Try to get from cache first
            if (apiCache.has(cacheKey)) {
                return res.json(apiCache.get(cacheKey));
            }

            const data = await sketchfabService.searchModels(query, cursor);

            // Save to cache
            apiCache.set(cacheKey, data);

            res.json(data);
        } catch (error: any) {
            console.error("Sketchfab Search Error:", error.message || error);
            res.status(500).json({ error: error.message || "Internal Server Error" });
        }
    }

    /**
     * GET /api/sketchfab/models/:id
     */
    async getModel(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const cacheKey = `sketchfab_model_${id}`;

            // Try to get from cache first
            if (apiCache.has(cacheKey)) {
                return res.json(apiCache.get(cacheKey));
            }

            const data = await sketchfabService.getModelById(id);

            // Save to cache
            apiCache.set(cacheKey, data);

            res.json(data);
        } catch (error: any) {
            console.error("Sketchfab Details Error:", error.message || error);
            res.status(500).json({ error: error.message || "Internal Server Error" });
        }
    }

    /**
     * GET /api/sketchfab/models/:id/download
     * Returns a temporary download URL for the model
     */
    async getDownload(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const data = await sketchfabService.getDownloadUrl(id);
            res.json(data);
        } catch (error: any) {
            console.error("Sketchfab Download Error:", error.message || error);
            res.status(500).json({ error: error.message || "Internal Server Error" });
        }
    }
}

export const sketchfabController = new SketchfabController();
