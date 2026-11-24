import dotenv from "dotenv/config"
import express from "express"
import connectDb from "./config/db.js"
import MainRouter from "./router/Router.js"
import GlobalError from "./Error.js" // Fixed typo in import
import cookieParser from "cookie-parser"
import cors from "cors"
import {rateLimit} from "express-rate-limit"

const app = express()

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100// limit each IP to 100 requests per windowMs
});
app.use(limiter);

await connectDb()
app.use(cors({
    origin: ["http://localhost:5173","https://e-commerce-grocery-website-beta.vercel.app"],
    secure:false,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use("/api/v1", MainRouter)

// Global Error Handler
app.use(GlobalError)

export default app