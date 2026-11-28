import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

import connectDb from "./config/db.js";
import MainRouter from "./router/Router.js";
import GlobalError from "./Error.js";

const app = express();

// 2. CORS - Works seamlessly in both local development & Vercel production
const allowedOrigins = [
  "https://e-commerce-grocery-website-iota.vercel.app",
  "https://e-commerce-grocery-website-six.vercel.app",
  "https://e-commerce-grocery-website-tau.vercel.app",
  "https://e-commerce-grocery-website-beta.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);

    try {
      const parsedUrl = new URL(origin);
      const hostname = parsedUrl.hostname;

      // Allow all localhost/127.0.0.1 ports in development, and *.vercel.app in production
      const isAllowed =
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.endsWith(".vercel.app") ||
        allowedOrigins.includes(origin);

      if (isAllowed) {
        return callback(null, true);
      }

      console.warn("[CORS Blocked]:", origin);
      return callback(null, false);
    } catch {
      return callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "X-Requested-With",
    "Origin",
  ],
  optionsSuccessStatus: 200,
};

// Mount CORS (automatically handles OPTIONS preflights for all routes)
app.use(cors(corsOptions));

// 3. Rate Limiter (Relaxes limits to prevent false-positives in dev & prod)
app.use(
  rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === "OPTIONS",
  })
);

// 4. Request Parsers
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

// 6. Mount API Routes
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
