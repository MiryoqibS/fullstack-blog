// Настройка dotenv
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "./.env");

dotenv.config({ path: envPath });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Роуты
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
}));

app.use(userRoutes);
app.use(postRoutes);
app.use(commentRoutes);

export default app;