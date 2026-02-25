import { LRUCache } from "lru-cache";

// Create a cache: max 100 items, items expire after 1 hour (1000 * 60 * 60 ms)
const options = {
    max: 100,
    ttl: 1000 * 60 * 60,
};

export const apiCache = new LRUCache<string, any>(options);
