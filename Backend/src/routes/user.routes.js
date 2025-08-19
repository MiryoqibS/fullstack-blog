import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const UserRoutes = Router();

UserRoutes.get("/api/user/isAuth", authMiddleware, UserController.isAuthenticated);
UserRoutes.get("/api/user/profile", authMiddleware, UserController.getProfile);
UserRoutes.post("/api/user/register", UserController.register);
UserRoutes.post("/api/user/verify", UserController.verify);
UserRoutes.post("/api/user/login", UserController.login);
