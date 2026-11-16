import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/database.js";

const port = process.env.PORT || 5000;

try {
  await connectDB();
  app.listen(port, "0.0.0.0", () => {
    console.log(`Boarding House API running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
  });
} catch (error) {
  console.error("Server startup failed:", error.message);
  process.exit(1);
}
