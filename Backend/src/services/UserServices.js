import User from "../models/User.js";
import bcrypt from "bcrypt";
import { verificationCodeServices } from "./VerificationCodeServices.js";
import { mailServices } from "./MailServices.js";

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

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

            // Создаём пользователя
            const user = await User.create({ username, password: hashedPassword, email, isVerified: false })

            const code = generateCode();
            await verificationCodeServices.createCode(user._id, code);

            await mailServices.sendMail(
                email,
                "Подтверждение регистрации | Miryoqib Blog",
                `Ваш код подтверждения аккаунта: ${code}`,
                `<p>Ваш код: <b>${code}</b></p>`
            );

            return user;
        } catch (error) {
            throw new Error("Ошибка при создании пользователя")
        }
    }

    async verifyUser(userId, code) {
        const record = await verificationCodeServices.findCode(userId);
        if (!record) throw new Error("Неверный идентификатор пользователя");
        if (new Date(record.expiresAt) < Date.now()) throw new Error("Время кода истекло");

        const isMatch = record.code === code;

        if (!isMatch) throw new Error("Код не совпадает");

        await User.findByIdAndUpdate(userId, { isVerified: true });
        await verificationCodeServices.deleteCodes(userId);

        return true;
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
