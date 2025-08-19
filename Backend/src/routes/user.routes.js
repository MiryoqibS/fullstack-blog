import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { uploadAvatarImageMiddleware } from "../middlewares/uploadAvatarImage.middleware.js";

export const UserRoutes = Router();

UserRoutes.get("/api/user/isAuth", authMiddleware, UserController.isAuthenticated);
UserRoutes.get("/api/user/profile", authMiddleware, UserController.getProfile);
UserRoutes.post("/api/user/register", UserController.register);
UserRoutes.post("/api/user/verify", UserController.verify);
UserRoutes.post("/api/user/login", UserController.login);
UserRoutes.post("/api/user/avatar",
    authMiddleware,
    uploadAvatarImageMiddleware.single("avatar"),
    UserController.updateAvatar
);
