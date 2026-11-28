import dns from "dns"
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

import connectDb from "./config/db.js";
import MainRouter from "./router/Router.js";
import GlobalError from "./Error.js";
dns.setServers(["8.8.8.8","1.1.1.1"])
await connectDb()
   
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://e-commerce-grocery-website-iota.vercel.app",
  "https://e-commerce-grocery-website-six.vercel.app",
  "https://e-commerce-grocery-website-tau.vercel.app",
  "https://e-commerce-grocery-website-beta.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "X-Requested-With",
    ],
  })
);

// Rate limiter
app.use(
  rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === "OPTIONS",
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running smoothly",
    environment: process.env.NODE_ENV || "development",
  });
});

// Database connection middleware
app.use("/api/v1", async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    console.error("Database middleware error:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
      error:
        process.env.NODE_ENV === "production"
          ? "Please try again later"
          : error.message,
    });
  }
});

// API routes
app.use("/api/v1", MainRouter);

// Global error handler
app.use(GlobalError);

export default app;
