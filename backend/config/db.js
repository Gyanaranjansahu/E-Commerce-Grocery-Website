import "dotenv/config";
import dns from "dns";
import mongoose from "mongoose";

// Configure resilient DNS resolvers (fixes SRV lookup failures on Windows / loopback DNS)
try {
  const currentServers = dns.getServers();
  if (
    !currentServers ||
    currentServers.length === 0 ||
    currentServers.includes("127.0.0.1") ||
    currentServers.includes("::1")
  ) {
    dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  }
} catch (dnsErr) {
  console.warn("DNS resolver override notice:", dnsErr.message);
}

// Direct replica set connection string fallback (bypasses SRV lookup entirely)
const DIRECT_REPLICA_FALLBACK =
  "mongodb://gyana:Gyana12345@ac-pgsct8s-shard-00-00.cpumx9l.mongodb.net:27017,ac-pgsct8s-shard-00-01.cpumx9l.mongodb.net:27017,ac-pgsct8s-shard-00-02.cpumx9l.mongodb.net:27017/Ecommerse?ssl=true&replicaSet=atlas-9t84ks-shard-0&authSource=admin";

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 15000, // 15 seconds allows sufficient time for TLS & replica set handshakes
  socketTimeoutMS: 45000,
  maxPoolSize: 20,
  minPoolSize: 2,
};

async function tryConnect(uri, description) {
  console.log(`⏳ Attempting MongoDB connection via ${description}...`);
  return await mongoose.connect(uri, MONGO_OPTIONS);
}

async function connectDb() {
  // If already connected, return active connection
  if (mongoose.connection.readyState >= 1) {
    console.log("ℹ Using existing MongoDB connection");
    return mongoose.connection;
  }

  const primaryUri = process.env.MONGO_URI;
  if (!primaryUri) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  const directUri = process.env.MONGO_DIRECT_URI || DIRECT_REPLICA_FALLBACK;
  const maxRetries = 2;

  // Attempt 1: Try Primary URI
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const conn = await tryConnect(primaryUri, `Primary URI (Attempt ${attempt}/${maxRetries})`);
      console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
      return conn.connection;
    } catch (primaryErr) {
      console.warn(`⚠️ Primary connection attempt ${attempt} failed: ${primaryErr.message}`);

      // If SRV failure or server selection timeout, try direct replica set URI
      if (
        primaryUri.includes("+srv") &&
        directUri &&
        (primaryErr.message.includes("querySrv") ||
          primaryErr.message.includes("timed out") ||
          primaryErr.message.includes("ECONNREFUSED"))
      ) {
        try {
          console.log("🔄 Switching to direct replica set connection fallback...");
          const conn = await tryConnect(directUri, "Direct Replica Set Fallback");
          console.log(`✅ MongoDB connected successfully via replica set: ${conn.connection.host}`);
          return conn.connection;
        } catch (directErr) {
          console.warn("⚠️ Direct replica set fallback failed:", directErr.message);
        }
      }

      if (attempt < maxRetries) {
        console.log(`⏳ Retrying in 2 seconds...`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        // Log detailed senior-developer diagnosis
        console.error("\n=======================================================");
        console.error("❌ MONGODB CONNECTION DIAGNOSIS & ACTIONABLE STEPS:");
        console.error("=======================================================");
        console.error("1. IP Whitelist (Most Common Cause):");
        console.error("   - Go to MongoDB Atlas (https://cloud.mongodb.com)");
        console.error("   - Navigate to 'Network Access' -> 'IP Access List'");
        console.error("   - Add IP Address: 0.0.0.0/0 (Allow access from anywhere)");
        console.error("   - Or click 'ADD CURRENT IP ADDRESS' if your IP recently changed.");
        console.error("2. ISP / Port 27017 Firewall Block:");
        console.error("   - Some Wi-Fi networks (college/public/office) block port 27017.");
        console.error("   - Try switching to a mobile hotspot or different Wi-Fi connection.");
        console.error("3. Database User Credentials:");
        console.error("   - Verify username & password in 'Database Access' in Atlas.");
        console.error("=======================================================\n");
        throw primaryErr;
      }
    }
  }
}

export default connectDb;