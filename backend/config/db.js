import mongoose from "mongoose";
import dns from "node:dns";

let connectionPromise;

if (process.env.NODE_ENV !== "production") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (error) {
    console.warn(
      "Could not set custom DNS servers, using system default:",
      error.message
    );
  }
}

async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const mongoUrl = process.env.MONGODB_URL;
  if (!mongoUrl) {
    const error = new Error("MONGODB_URL is not configured");
    error.code = "MONGODB_URL_MISSING";
    throw error;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(mongoUrl, { serverSelectionTimeoutMS: 8000 })
      .then(() => {
        console.log(
          "✅ MongoDB Atlas connected successfully to database:",
          mongoose.connection.name
        );
        return mongoose.connection;
      })
      .finally(() => {
        connectionPromise = null;
      });
  }

  return connectionPromise;
}

export default connectDb;
