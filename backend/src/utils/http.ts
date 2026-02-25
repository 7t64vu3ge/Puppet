import axios, { AxiosInstance } from "axios";

/**
 * Creates and configures an Axios instance for external API calls.
 */
export const createHttpClient = (baseURL: string, token: string): AxiosInstance => {
    return axios.create({
        baseURL,
        headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
        },
    });
};

// Sketchfab Specific HTTP Client
export const sketchfabClient = createHttpClient(
    process.env.SKETCHFAB_API_URL || "https://api.sketchfab.com/v3",
    process.env.SKETCHFAB_TOKEN || "3f0b5437957d40d68477b247fa316aab"
);
