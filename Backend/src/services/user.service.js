import { User } from "../models/User.model.js";
import { verificationCodeServices } from "./verificationCode.service.js";
import { MailService } from "./mail.service.js";
import bcrypt from "bcrypt";

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

export const UserService = {
    // == Поиск пользователя по идентификатору ==
    async findUserById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            throw new Error("Ошибка при поиске пользователя по идентификатору");
        }
    },

    // == Поиск пользователя по электронной почте ==
    async findUserByEmail(email) {
        try {
            return await User.findOne({ email });
        } catch (error) {
            throw new Error("Ошибка при поиске пользователя по электронной почте");
        }
    },

    // == Создание пользователя ==
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

            await MailService.sendMail(
                email,
                "Подтверждение регистрации | Miryoqib Blog",
                `Ваш код подтверждения аккаунта: ${code}`,
                `<p>Ваш код: <b>${code}</b></p>`
            );

            return user;
        } catch (error) {
            throw new Error("Ошибка при создании пользователя")
        }
    },

    // == Подтверждения аккаунта пользователя ==
    async verifyUser(userId, code) {
        const record = await verificationCodeServices.findCode(userId);
        if (!record) throw new Error("Неверный идентификатор пользователя");
        if (new Date(record.expiresAt) < Date.now()) throw new Error("Время кода истекло");

        const isMatch = record.code === code;

        if (!isMatch) throw new Error("Код не совпадает");

        await User.findByIdAndUpdate(userId, { isVerified: true });
        await verificationCodeServices.deleteCodes(userId);

        return true;
    },

    // == Удаление пользователя ==
    async deleteUser(id) {
        try {
            return await User.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Ошибка при удалении пользователя")
        }
    },

    // == Проверка совпадения пароля ==
    async verifyPassword(password, hashedPassword) {
        try {
            return bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw new Error("Ошибка при проверки пароля");
        };
    },

    // == Изменения фото профиля ==
    async changeAvatar(userId, avatarPath) {
        try {
            const user = await User.findById(userId);
            if(!user) throw new Error("Пользователь не был найден");

            user.avatar = avatarPath;
            await user.save();

            return user;
        } catch (error) {
            throw new Error("Ошибка при изменении фото профиля");  
        };
    },
};