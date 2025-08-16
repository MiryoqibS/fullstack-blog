import { sessionServices } from "../services/SessionServices.js";
import { userServices } from "../services/UserServices.js";

const checkAuth = async (req, res, next) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ message: "Не авторизован " });
    };

    const session = await sessionServices.getSession(sessionId);

    if (!session || new Date(session.expiresAt) < Date.now()) {
        return res.status(400).json({ message: "Сессия не действительна или истекла" });
    };

    const user = await userServices.findUserById(session.userId);

    if (!user) {
        return res.status(401).json({ message: "Пользователь не найден" });
    }

    req.user = user.toJSON();

    next();
};

export default checkAuth;