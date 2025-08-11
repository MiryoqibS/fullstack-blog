import { Router } from "express";
// Контроллер
import * as PostController from "../controllers/PostController.js";

// Middlewares
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/api/posts", PostController.getPosts);
router.post("/api/posts", authMiddleware ,PostController.createPost);
router.get("/api/posts/:id", PostController.getPost);
router.put("/api/posts:id", PostController.updatePost);
router.delete("/api/posts/:id", PostController.deletePost);

export default router;