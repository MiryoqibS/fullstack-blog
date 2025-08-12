import * as CommentController from "../controllers/CommentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { Router } from "express";

const router = Router();

router.get("/api/comments/:id", CommentController.getComments);
router.post("/api/comments/:id", authMiddleware, CommentController.addComment);

export default router;