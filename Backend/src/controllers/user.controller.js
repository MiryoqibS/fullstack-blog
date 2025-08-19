import { SessionService } from "../services/session.service.js";
import { UserService } from "../services/user.service.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // == Обновление фото профиля ==
    async updateAvatar(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Изображение не загружено" });
            };

            const userId = req.user.id;
            const user = await UserService.findUserById(userId);

            if (user.avatar) {
                const oldFilename = user.avatar.split("/avatars/")[1];
                const oldPath = path.join(__dirname, "../uploads/avatars/", oldFilename);

                if (oldFilename !== "default.webp") {
                    try {
                        await fs.access(oldPath);
                        await fs.unlink(oldPath);
                    } catch (error) {
                        if (error.code !== "ENOENT") {
                            console.error(`Ошибка при удалении старого фото профиля: ${error.message}`);
                        };
                    };
                };
            };

            const avatarPath = `http://192.168.100.151:5000/storage/avatars/${req.file.filename}`;
            const updatedUser = await UserService.changeAvatar(userId, avatarPath);

            return res.status(200).json({
                message: "Фото профиля успешно обновлено",
                avatar: avatarPath,
                user: updatedUser
            });
        } catch (error) {
            return res.status(500).json({ message: "Ошибка сервера" });
        };
    },
};

