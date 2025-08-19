import { Router } from "express";
import { PostController } from "../controllers/post.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadPostImageMiddleware } from "../middlewares/uploadPostImage.middleware.js";

export const PostRoutes = Router();

PostRoutes.get("/api/posts", PostController.getPosts);
PostRoutes.post("/api/posts",
    authMiddleware,
    uploadPostImageMiddleware.single("thumbnail"),
    PostController.createPost
);
PostRoutes.get("/api/posts/latest", PostController.getLatestPosts);
PostRoutes.get("/api/posts/:id", PostController.getPost);
PostRoutes.put("/api/posts:id", authMiddleware, PostController.updatePost);
PostRoutes.delete("/api/posts/:id", authMiddleware, PostController.deletePost);