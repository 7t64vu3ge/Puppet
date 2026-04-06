import axios from "axios";

const token = "3f0b5437957d40d68477b247fa316aab";
const baseURL = "https://api.sketchfab.com/v3";

async function testTrending() {
    try {
        const response = await axios.get(`${baseURL}/search`, {
            params: {
                type: "models",
                sort_by: "-likeCount"
            },
            headers: {
                Authorization: `Token ${token}`
            }
        });
        console.log("Search status:", response.status);
        if (response.data.results && response.data.results.length > 0) {
            console.log("First result:", response.data.results[0].name);
        } else {
            console.log("No results");
        }
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
    }
}

testTrending();
