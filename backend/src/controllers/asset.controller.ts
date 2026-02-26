import { Request, Response } from "express";
import { assetService } from "../services/asset.service.js";

export class AssetController {
    /**
     * POST /api/assets
     * Protected: seller or admin only
     */
    async createAsset(req: Request, res: Response) {
        try {
            const { title, description, price, previewModelId, thumbnailUrl } = req.body;

            // Validate required fields
            if (!title || typeof title !== "string" || title.trim() === "") {
                return res.status(400).json({ error: "title is required" });
            }
            if (price === undefined || price === null || typeof price !== "number" || price < 0) {
                return res.status(400).json({ error: "price must be a number >= 0" });
            }

            const asset = await assetService.createAsset({
                title: title.trim(),
                description: description ?? "",
                price,
                previewModelId,
                thumbnailUrl,
                ownerId: req.user!.id,
            });

            return res.status(201).json(asset);
        } catch (error: any) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    }

    /**
     * GET /api/assets
     * Public — paginated, optional ?search=
     */
    async getAssets(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const search = (req.query.search as string) || undefined;

            const result = await assetService.getAssets({ page, limit, search });
            return res.json(result);
        } catch (error: any) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    }

    /**
     * GET /api/assets/:id
     * Public
     */
    async getAssetById(req: Request, res: Response) {
        try {
            const asset = await assetService.getAssetById(req.params.id);

            if (!asset) {
                return res.status(404).json({ error: "Asset not found" });
            }

            return res.json(asset);
        } catch (error: any) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    }

    /**
     * PUT /api/assets/:id
     * Protected — owner or admin only (req.asset pre-loaded by ownership middleware)
     */
    async updateAsset(req: Request, res: Response) {
        try {
            const { title, description, price, previewModelId, thumbnailUrl } = req.body;

            // Validate price if provided
            if (price !== undefined && (typeof price !== "number" || price < 0)) {
                return res.status(400).json({ error: "price must be a number >= 0" });
            }
            // Validate title if provided
            if (title !== undefined && (typeof title !== "string" || title.trim() === "")) {
                return res.status(400).json({ error: "title must be a non-empty string" });
            }

            const updated = await assetService.updateAsset(req.asset!, {
                title: title?.trim(),
                description,
                price,
                previewModelId,
                thumbnailUrl,
            });

            return res.json(updated);
        } catch (error: any) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    }

    /**
     * DELETE /api/assets/:id
     * Protected — owner or admin only (req.asset pre-loaded by ownership middleware)
     */
    async deleteAsset(req: Request, res: Response) {
        try {
            await assetService.deleteAsset(req.asset!);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({ error: error.message || "Internal server error" });
        }
    }
}

export const assetController = new AssetController();
