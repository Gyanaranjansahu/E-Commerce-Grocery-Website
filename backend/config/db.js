import mongoose from "mongoose";

let connectionPromise = null;

const connectDb = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUrl = process.env.MONGODB_URL;

  if (!mongoUrl) {
    throw new Error("MONGODB_URL is missing in environment variables");
  }

  connectionPromise = mongoose
    .connect(mongoUrl, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 0,
    })
    .then(() => {
      console.log("MongoDB connected:", mongoose.connection.name);
      return mongoose.connection;
    })
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      throw error;
    })
    .finally(() => {
      connectionPromise = null;
    });

  return connectionPromise;
};

export default connectDb;