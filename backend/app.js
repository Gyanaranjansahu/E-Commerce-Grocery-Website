import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

import connectDb from "./config/db.js";
import MainRouter from "./router/Router.js";
import GlobalError from "./Error.js";

const app = express();

// 1. Allowed frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "https://e-commerce-grocery-website-iota.vercel.app",
  "https://e-commerce-grocery-website-six.vercel.app",
  "https://e-commerce-grocery-website-tau.vercel.app",
  "https://e-commerce-grocery-website-beta.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// 2. CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman and server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked origin:", origin);
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

    optionsSuccessStatus: 204,
  })
);

// 3. Rate Limiter
app.use(
  rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === "OPTIONS",
  })
);

// 4. Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running smoothly",
    environment: process.env.NODE_ENV || "development",
  });
});

// 6. API Routes and Database Connection
app.use(
  "/api/v1",
  async (req, res, next) => {
    try {
      await connectDb();
      next();
    } catch (error) {
      next(error);
    }
  },
  MainRouter
);

// 7. Global Error Handler
app.use(GlobalError);

export default app;