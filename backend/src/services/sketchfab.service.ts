import { sketchfabClient } from "../utils/http.js";

export class SketchfabService {
    /**
     * Search for models on Sketchfab
     * @param query Search term
     */
    async searchModels(query: string) {
        try {
            const response = await sketchfabClient.get("/search", {
                params: {
                    type: "models",
                    q: query
                }
            });
            // Sketchfab returns data inside response.data
            return response.data;
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
            const response = await sketchfabClient.get(`/models/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching Sketchfab model ${id}:`, error);
            throw new Error("Failed to fetch Sketchfab model details");
        }
    }
}

export const sketchfabService = new SketchfabService();
