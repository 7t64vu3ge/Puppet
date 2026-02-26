import Asset, { IAsset } from "../models/asset.model.js";
import mongoose from "mongoose";

export interface CreateAssetData {
    title: string;
    description?: string;
    price: number;
    previewModelId?: string;
    thumbnailUrl?: string;
    ownerId: string;
}

export interface UpdateAssetData {
    title?: string;
    description?: string;
    price?: number;
    previewModelId?: string;
    thumbnailUrl?: string;
}

export interface GetAssetsOptions {
    page?: number;
    limit?: number;
    search?: string;
}

export class AssetService {
    /**
     * Create a new asset
     */
    async createAsset(data: CreateAssetData): Promise<IAsset> {
        return Asset.create(data);
    }

    /**
     * List assets with pagination and optional title search
     */
    async getAssets(options: GetAssetsOptions) {
        const page = Math.max(1, options.page ?? 1);
        const limit = Math.min(100, Math.max(1, options.limit ?? 20));
        const skip = (page - 1) * limit;

        // Build query: if search provided, use MongoDB text search; else match all
        const query = options.search
            ? { $text: { $search: options.search } }
            : {};

        const [data, total] = await Promise.all([
            Asset.find(query)
                .populate("ownerId", "id name email avatar role")
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Asset.countDocuments(query),
        ]);

        return { data, total, page, limit };
    }

    /**
     * Get a single asset by ID (populates owner)
     */
    async getAssetById(id: string): Promise<IAsset | null> {
        if (!mongoose.Types.ObjectId.isValid(id)) return null;
        return Asset.findById(id).populate("ownerId", "id name email avatar role");
    }

    /**
     * Update an asset's mutable fields (partial update)
     */
    async updateAsset(asset: IAsset, data: UpdateAssetData): Promise<IAsset> {
        Object.assign(asset, data);
        return asset.save();
    }

    /**
     * Hard-delete an asset
     */
    async deleteAsset(asset: IAsset): Promise<void> {
        await asset.deleteOne();
    }
}

export const assetService = new AssetService();
