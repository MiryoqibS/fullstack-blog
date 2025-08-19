import { SessionService } from "../services/session.service.js";
import { UserService } from "../services/user.service.js";

export const UserController = {
    // == Регистрация ==
    async register(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            const userObj = user.toObject();
            delete userObj.password;
            return res.status(201).json(userObj);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },

    // == Подтверждения аккаунта ==
    async verify(req, res) {
        try {
            const { userId, code } = req.body;
            await UserService.verifyUser(userId, code);
            return res.status(200).json({ message: "Аккаунт успешно подтверждён", isVerified: true });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },

    // == Авторизация ==
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await UserService.findUserByEmail(email);

            if (!user) {
                return res.status(404).json({ message: "Пользователь не был найден" });
            };

            if (!user.isVerified) {
                return res.status(403).json({ message: "Пользователь не подтвердил аккаунт" });
            };

            const isMatch = await UserService.verifyPassword(password, user.password);
            
            if (!isMatch) {
                return res.status(400).json({ message: "Пароли не совпадают" });
            };

            const session = await SessionService.createSession(user._id);

            res.cookie("sessionId", session._id, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24,
            });

            return res.status(200).json({ message: "Успешно авторизовались" });
        } catch (error) {
            return res.status(500).json({ message: "Ошибка сервера" });
        };
    },

    // == Проверка авторизации ==
    async isAuthenticated(req, res) {
        try {
            const user = req.user;

            if (!user) return res.status(200).json({ isAuth: false });

            return res.status(200).json({ isAuth: true });
        } catch (error) {
            return res.status(500).json({ message: "Ошибка сервера" });
        };
    },

    // == Получение профиля ==
    async getProfile(req, res) {
        try {
            const user = req.user;
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Ошибка сервера" });
        };
    },
};

