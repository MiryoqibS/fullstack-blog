import { Router } from "express";
import * as UserController from "../controllers/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = Router();

router.get("/api/user/isAuth", authMiddleware, UserController.isAuthenticated);
router.get("/api/user/profile", authMiddleware, UserController.getProfile);
router.post("/api/user/register", UserController.register);
router.post("/api/user/login", UserController.login);

export default router