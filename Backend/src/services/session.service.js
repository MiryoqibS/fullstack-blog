import { Session } from "../models/session.model.js";

export const SessionService = {
    // == Создание сессии ==
    async createSession(userId) {
        try {
            if (!userId) throw new Error("Идентификатор пользователя не был передан");

            const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 часа

            return await Session.create({userId, expiresAt});
        } catch (error) {
            throw new Error("Ошибка при создании сессии")
        };
    },

    // == Поиск сессии ==
    async getSession(id) {
        try {
            return Session.findById(id);
        } catch (error) {
            throw new Error("Ошибка при получении сессии")
        }
    },

    // == Удаление сессии ==
    async deleteSession(id) {
        try {
            return Session.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Ошибка при удалении сессии")
        }
    },
};