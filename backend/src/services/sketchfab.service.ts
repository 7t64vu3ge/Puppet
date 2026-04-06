import { sketchfabClient } from "../utils/http.js";

export class SketchfabService {
    /**
     * Search for models on Sketchfab
     * @param query Search term
     * @param cursor Pagination cursor
     */
    async searchModels(query: string, cursor?: string) {
        try {
            const params: any = { type: "models" };
            if (query) {
                params.q = query;
            } else {
                params.sort_by = "-likeCount";
            }
            if (cursor) {
                params.cursor = cursor;
            }

            const response = await sketchfabClient.get("search", { params });

            // Normalize results
            const normalizedResults = response.data.results.map((model: any) => this.normalizeModel(model));

            return {
                results: normalizedResults,
                nextCursor: response.data.cursors?.next || null,
                total: response.data.count || normalizedResults.length
            };
        } catch (error) {
            console.error("Error searching Sketchfab models:", error);
            throw new Error("Failed to search Sketchfab models");
        }
    }

    /**
     * Get details for a specific model by ID
     * @param id Model ID
     */
    async getModelById(id: string) {
        try {
            const response = await sketchfabClient.get(`models/${id}`);
            return this.normalizeModel(response.data);
        } catch (error) {
            console.error(`Error fetching Sketchfab model ${id}:`, error);
            throw new Error("Failed to fetch Sketchfab model details");
        }
    }

    /**
     * Get download URL for a model
     * Sketchfab provides a temporary download link via their API
     */
    async getDownloadUrl(id: string) {
        try {
            const response = await sketchfabClient.get(`models/${id}/download`);
            return {
                url: response.data?.gltf?.url || response.data?.glb?.url || null,
                expires: response.data?.gltf?.expires || response.data?.glb?.expires || null,
            };
        } catch (error: any) {
            console.error(`Error fetching download for ${id}:`, error?.response?.status, error?.response?.data);
            // If 403/404, the model isn't downloadable
            if (error?.response?.status === 403 || error?.response?.status === 404) {
                return { url: null, expires: null, error: "This model is not downloadable" };
            }
            throw new Error("Failed to fetch download URL");
        }
    }

    /**
     * Normalizes Sketchfab model data into our internal format
     */
    private normalizeModel(model: any) {
        // Find highest resolution thumbnail if available
        const thumbImages = model.thumbnails?.images || [];
        const highestResThumb = thumbImages.length > 0 
            ? thumbImages.sort((a: any, b: any) => b.width - a.width)[0]?.url 
            : null;

        return {
            id: model.uid,
            _id: model.uid,
            title: model.name || "Untitled",
            description: model.description || "",
            thumbnailUrl: highestResThumb,
            previewModelId: model.uid, // explicitly for use in embeds
            price: 0, // Sketchfab search API doesn't always return price, defaults to 0
            isDownloadable: model.isDownloadable || false,
            author: model.user?.displayName || "Unknown Artist"
        };
    }
}

export const sketchfabService = new SketchfabService();
