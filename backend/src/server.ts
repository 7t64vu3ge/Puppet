import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const startServer = async () => {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start Express Server
    app.listen(process.env.PORT || 4000, () =>
        console.log(`Server running on http://localhost:4000`)
    );
};

startServer();