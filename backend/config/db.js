import mongoose from "mongoose";
import dns from "node:dns";

// Fix for Windows / ISP DNS resolvers failing on MongoDB Atlas SRV records
// Sets Google DNS (8.8.8.8) and Cloudflare DNS (1.1.1.1) for reliable SRV resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("Could not set custom DNS servers, using system default:", e.message);
}

async function connectDb() {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      console.error("❌ MONGODB_URL is not defined in backend .env!");
      return;
    }

    await mongoose.connect(mongoUrl, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log("✅ MongoDB Atlas connected successfully to database:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB Atlas connection FAILED:", error.message);
    if (error.message.includes("querySrv")) {
      console.error("👉 DNS SRV resolution issue. Ensure DNS 8.8.8.8 is reachable or check Atlas network access.");
    }
  }
}

export default connectDb;
