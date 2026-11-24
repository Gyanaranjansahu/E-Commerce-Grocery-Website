import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";
import connectDb from "./config/db.js";
import MainRouter from "./router/Router.js";
import GlobalError from "./Error.js";

const app = express();

// =========================================================================
// 1. DATABASE CONNECTION
// Connects to MongoDB Atlas using custom DNS servers (8.8.8.8) to resolve SRV records
// =========================================================================
connectDb();

// =========================================================================
// 2. PRODUCTION & DEVELOPMENT CORS CONFIGURATION
// Placed before all other middlewares and routes to ensure CORS headers are
// attached to EVERY request, including preflight OPTIONS and error responses.
// =========================================================================
const allowedOrigins = [
  "https://e-commerce-grocery-website-six.vercel.app",
  "https://e-commerce-grocery-website-tau.vercel.app",
  "https://e-commerce-grocery-website-beta.vercel.app",
  "https://e-commerce-grocery-website-iota.vercel.app/"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow non-browser requests (Postman, curl, backend-to-backend)
    if (!origin) return callback(null, true);

    try {
      const parsedUrl = new URL(origin);
      const hostname = parsedUrl.hostname;

      const isAllowed =
        allowedOrigins.includes(origin) ||
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname.endsWith(".vercel.app") ||
        (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL);

      if (isAllowed) {
        return callback(null, true);
      } else {
        console.warn(`[CORS Blocked] Origin not allowed: ${origin}`);
        return callback(null, false);
      }
    } catch (err) {
      return callback(null, false);
    }
  },
  credentials: true, // Required for Access_token & Refresh_token cookies
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  optionsSuccessStatus: 200, // Legacy browsers support
};

// Mount CORS and explicit preflight handler
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// =========================================================================
// 3. RATE LIMITING
// Must be registered AFTER cors so that any 429 response includes CORS headers!
// =========================================================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Relaxed limit to avoid false-positive blocking in dev
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS", // Never throttle preflight checks!
  message: {
    success: false,
    message: "Rate limit exceeded. Please wait 15 minutes before retrying.",
  },
});
app.use(limiter);

// =========================================================================
// 4. REQUEST PARSERS
// =========================================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =========================================================================
// 5. HEALTH CHECK & API ROUTES
// =========================================================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy and running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/v1", MainRouter);

// =========================================================================
// 6. GLOBAL ERROR HANDLER
// =========================================================================
app.use(GlobalError);

export default app;
