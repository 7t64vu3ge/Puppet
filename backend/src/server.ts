import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const startServer = async () => {
    const port = Number(process.env.PORT || 4000);

    // 1. Connect to MongoDB
    await connectDB();

    // 2. Start Express Server
    app.listen(port, "0.0.0.0", () =>
        console.log(`Server running on port ${port}`)
    );
};

startServer();
