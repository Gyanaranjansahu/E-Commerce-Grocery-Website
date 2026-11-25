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
  "https://e-commerce-grocery-website-tau.vercel.app",
  "https://e-commerce-grocery-website-beta.vercel.app",
  "https://e-commerce-grocery-website-iota.vercel.app",
  "https://e-commerce-grocery-website-jw2v0je2k-gyanaranjansahus-projects.vercel.app",
  "https://e-commerce-grocery-website-yueeujc2p-gyanaranjansahus-projects.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin === "http://localhost:5173"
      ) {
        return callback(null, true);
      }

      console.log("CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
    ],
  })
);

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