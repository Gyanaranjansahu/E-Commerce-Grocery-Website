import "dotenv/config";
import dns from "dns";

// Override DNS servers early (fixes MongoDB Atlas SRV lookup issues on cloud hosts)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import app from "./app.js";
import connectDb from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Wait for Database connection before binding port
    await connectDb();
    console.log("✅ Database connection established");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();