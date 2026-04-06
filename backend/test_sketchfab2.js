import axios from "axios";

const token = "3f0b5437957d40d68477b247fa316aab";
const baseURL = "https://api.sketchfab.com/v3";

async function testSearch() {
    try {
        const response = await axios.get(`${baseURL}/search`, {
            params: {
                type: "models"
            },
            headers: {
                Authorization: `Token ${token}`
            }
        });
        console.log("Search status:", response.status);
        console.log("Count:", response.data.results.length);
        console.log("First result:", response.data.results[0].name);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testSearch();
