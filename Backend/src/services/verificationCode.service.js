import { VerificationCode } from "../models/VerificationCode.model.js";

class VerificationCodeServices {
    async createCode(userId, code) {
        try {
            const expiresAt = new Date(Date.now() + 1000 * 60 * 15) // 15 минут
            return await VerificationCode.create({userId, code, expiresAt});
        } catch (error) {
            throw new Error("Ошибка при создании кода подтверждения");
        };
    }

    async findCode(userId) {
        try {
            return await VerificationCode.findOne({ userId });
        } catch (error) {
            throw new Error("Ошибка при поиске кода подтверждения");
        };
    }

    async deleteCodes(userId) {
        try {
            return await VerificationCode.deleteMany({ userId });
        } catch (error) {
            throw new Error("Ошибка при удалении кодов подтверждения пользователя")
        };
    }
};

export const verificationCodeServices = new VerificationCodeServices();