import "dotenv/config";
import app from "./app.js";

app.listen(process.env.PORT || 4000, () =>
    console.log(`Server running on http://localhost:4000`)
);