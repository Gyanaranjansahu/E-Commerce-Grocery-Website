import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

import connectDb from "./config/db.js";
import MainRouter from "./router/Router.js";
import GlobalError from "./Error.js";

const app = express();

// 1. Database
connectDb();

// 2. CORS
const allowedOrigins = [
  "https://e-commerce-grocery-website-iota.vercel.app",
  "https://e-commerce-grocery-website-six.vercel.app",
  "https://e-commerce-grocery-website-tau.vercel.app",
  "https://e-commerce-grocery-website-beta.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (Postman, curl, backend-to-backend)
    if (!origin) return callback(null, true);

    try {
      const parsedUrl = new URL(origin);
      const hostname = parsedUrl.hostname;

      // Allow all localhost ports and any vercel preview/production domain
      const isAllowed =
        allowedOrigins.includes(origin) ||
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.endsWith(".vercel.app");

      if (isAllowed) {
        return callback(null, true);
      }

      console.warn("CORS blocked origin:", origin);
      // Return false without throwing Error so Express doesn't crash into 500
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

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 3. Rate Limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === "OPTIONS",
  })
);

// 4. Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 5. Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// 6. API Routes
app.use("/api/v1", MainRouter);

// 7. Global Error Handler
app.use(GlobalError);

export default app;