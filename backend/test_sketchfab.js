import axios from "axios";

const token = "3f0b5437957d40d68477b247fa316aab";
const baseURL = "https://api.sketchfab.com/v3";

function normalizeModel(model) {
    const thumbImages = model.thumbnails?.images || [];
    const highestResThumb = thumbImages.length > 0 
        ? thumbImages.sort((a, b) => b.width - a.width)[0]?.url 
        : null;

    return {
        id: model.uid,
        title: model.name || "Untitled",
        description: model.description || "",
        thumbnailUrl: highestResThumb,
        previewModelId: model.uid,
        price: 0,
        isDownloadable: model.isDownloadable || false,
        author: model.user?.displayName || "Unknown Artist"
    };
}

async function testSearch() {
    try {
        const response = await axios.get(`${baseURL}/search`, {
            params: {
                type: "models",
                q: "car"
            },
            headers: {
                Authorization: `Token ${token}`
            }
        });
        console.log("Search status:", response.status);
        
        const normalized = response.data.results.map(normalizeModel);
        console.log("Normalized result sample:", normalized[0]);
        console.log("Next cursor:", response.data.cursors?.next || null);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testSearch();
