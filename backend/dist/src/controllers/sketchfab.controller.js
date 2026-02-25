import { sketchfabService } from "../services/sketchfab.service.js";
import { apiCache } from "../utils/cache.js";
export class SketchfabController {
    /**
     * GET /api/sketchfab/search
     * Expects a query parameter `q`
     */
    async search(req, res) {
        try {
            const query = req.query.q;
            if (!query) {
                return res.status(400).json({ error: "Missing search query 'q'" });
            }
            const cacheKey = `sketchfab_search_${query}`;
            // Try to get from cache first
            if (apiCache.has(cacheKey)) {
                return res.json(apiCache.get(cacheKey));
            }
            const data = await sketchfabService.searchModels(query);
            // Save to cache
            apiCache.set(cacheKey, data);
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ error: error.message || "Internal Server Error" });
        }
    }
    /**
     * GET /api/sketchfab/models/:id
     */
    async getModel(req, res) {
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
        }
        catch (error) {
            res.status(500).json({ error: error.message || "Internal Server Error" });
        }
    }
}
export const sketchfabController = new SketchfabController();
