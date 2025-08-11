import User from "../models/User.js";
import bcrypt from "bcrypt";

class UserServices {
    async findUserById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            throw new Error("Ошибка при поиске пользователя по идентификатору");
        }
    }

    async findUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error("Ошибка при поиске пользователя по электронной почте");
        }
    }

    async createUser(data) {
        try {
            const { username, password, email } = data;

            if (!username) throw new Error("Имя пользователя отсутствует");

            if (!password) throw new Error("Пароль пользователя отсутствует");

            if (!email) throw new Error("Электронная почта пользователя отсутствует");

            const SALT_ROUNDS = 10;
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

            return await User.create({ username, password: hashedPassword, email });
        } catch (error) {
            throw new Error("Ошибка при создании пользователя")
        }
    }

    async deleteUser(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Ошибка при удалении пользователя")
        }
    }

    async verifyPassword(password, hashedPassword) {
        try {
            return bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw new Error("Ошибка при проверки пароля")
        }
    }
};

export const userServices = new UserServices();