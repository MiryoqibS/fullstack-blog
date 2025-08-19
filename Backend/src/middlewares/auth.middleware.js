import { SessionService } from "../services/session.service.js";
import { UserService } from "../services/user.service.js";

export const authMiddleware = async (req, res, next) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ message: "Не авторизован " });
    };

    const session = await SessionService.getSession(sessionId);

    if (!session || new Date(session.expiresAt) < Date.now()) {
        return res.status(400).json({ message: "Сессия не действительна или истекла" });
    };

    const user = await UserService.findUserById(session.userId);

    if (!user) {
        return res.status(401).json({ message: "Пользователь не найден" });
    }

    req.user = user.toJSON();

    next();
};