import mongoose from "mongoose";

async function connectDb() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    // Check if an active connection already exists
    if (mongoose.connection.readyState >= 1) {
      console.log("ℹ Using existing MongoDB connection");
      return mongoose.connection;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
    });

    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error; // Re-throw so startServer() in index.js can catch it and handle process.exit(1)
  }
}

export default connectDb;