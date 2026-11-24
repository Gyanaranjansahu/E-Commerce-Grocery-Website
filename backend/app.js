import "dotenv/config";
import express from "express";
// import connectDb from "./config/db.js";
import MainRouter from "./router/Router.js";
import GlobalError from "./Error.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { rateLimit } from "express-rate-limit";

const app = express();

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
});

app.use(limiter);

// CORS Configuration
app.use(cors({
    origin: [
        "http://localhost:5173",
       "https://e-commerce-grocery-website-six.vercel.app"
        // Add your new frontend Vercel URL here
    ],
    credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is healthy"
    });
});

// API Routes
app.use("/api/v1", MainRouter);

// Global Error Handler
app.use(GlobalError);

export default app;