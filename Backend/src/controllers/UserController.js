import { sessionServices } from "../services/SessionServices.js";
import { userServices } from "../services/UserServices.js";

// Регистрация
export const register = async (req, res) => {
    try {
        const user = await userServices.createUser(req.body);
        return res.status(201).json(user);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

// Авторизация
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userServices.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ message: "Пользователь не был найден" });
        };

        const isMatch = await userServices.verifyPassword(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Пароли не совпадают" });
        };

        const session = await sessionServices.createSession(user._id);

        res.cookie("sessionId", session._id, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
        });

        return res.status(200).json({ message: "Успешно авторизовались" });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

// Проверка авторизации
export const isAuthenticated = async (req, res) => {
    try {
        const user = req.user;

        if (!user) return res.status(200).json({ isAuth: false });

        return res.status(200).json({ isAuth: true });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

// Получение профиля
export const getProfile = async (req, res) => {
    try {
        const user = req.user;   
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
}