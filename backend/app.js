import "dotenv/config";
import express from "express";
import connectDb from "./config/db.js";
import MainRouter from "./router/Router.js";
import GlobalError from "./Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import path from "path";

const app = express();

// Database connection
connectDb();

// Rate limiting (sensible limit: 1000 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use(limiter);

// CORS configuration supporting Vite dev ports
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
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