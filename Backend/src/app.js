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
import { PostRoutes } from "./routes/post.routes.js";
import { UserRoutes } from "./routes/user.routes.js";
import { commentRoutes } from "./routes/comment.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
}));

app.use("/storage/avatars", express.static(path.join(__dirname, "uploads/avatars")));
app.use("/storage/posts", express.static(path.join(__dirname, "uploads/posts")));

app.use(UserRoutes);
app.use(PostRoutes);
app.use(commentRoutes);

export default app;