import { Request, Response } from "express";
import { assetService } from "../services/asset.service.js";
import { sketchfabService } from "../services/sketchfab.service.js";

export class MarketplaceController {
    /**
     * GET /api/marketplace
     * Centralized search that combines local assets and Sketchfab models
     */
    async search(req: Request, res: Response) {
        try {
            const query = (req.query.q as string) || "";
            const page = parseInt(req.query.page as string) || 1;

            // Fetch local assets first
            const localResults = await assetService.getAssets({
                search: query,
                page: page,
                limit: 10
            });

            // Fetch Sketchfab models
            const sketchfabData = await sketchfabService.searchModels(query);
            const sketchfabResults = sketchfabData.results || [];

            // Mapping Sketchfab results to a common format (optional, but good for UI consistency)
            // For now, we'll return both separately or merged
            
            res.json({
                local: localResults.data,
                external: sketchfabResults,
                totalLocal: localResults.total,
                nextExternalCursor: sketchfabData.nextCursor
            });
        } catch (error: any) {
            console.error("Marketplace Search Error:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
}

export const marketplaceController = new MarketplaceController();
