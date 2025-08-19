import { Router } from "express";
import { CommentController } from "../controllers/comment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const commentRoutes = Router();

commentRoutes.get("/api/comments/:id", CommentController.getComments);
commentRoutes.post("/api/comments/:id", authMiddleware, CommentController.addComment);