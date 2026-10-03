import "dotenv/config";
import express from "express";
import MainRouter from "./router/Router.js";
import GlobalError from "./Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import path from "path";

const app = express();

// Enable trust proxy for platforms like Render/Vercel (required for rate-limit)
app.set("trust proxy", 1);

// Rate limiting (sensible limit: 1000 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: "Too many requests, please try again later." },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
});
app.use(limiter);

// Allowed Origins Configuration
app.set("trust proxy", 1);
const allowedOrigins = [
  process.env.FRONTEND_URL, // Dynamically pulled from environment variable
  "https://e-commerce-grocery-website-tau.vercel.app",
  "http://localhost:5173", // Vite default
  "http://localhost:3000",
  "https://e-commerce-grocery-website-beta.vercel.app" // React/Next default
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., Postman, mobile apps) or matching origins
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        /^http:\/\/localhost:\d+$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy blocked access for origin: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static file serving for local uploads
app.use("/uploads", express.static(path.resolve("uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// API Routes
app.use("/api/v1", MainRouter);

// Global Error Handler
app.use(GlobalError);

export default app;