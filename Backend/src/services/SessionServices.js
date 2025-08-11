import Session from "../models/Session.js";

class SessionServices {
    async createSession(userId) {
        try {
            if (!userId) throw new Error("Идентификатор пользователя не был передан");

            const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24 часа

            return await Session.create({userId, expiresAt});
        } catch (error) {
            throw new Error("Ошибка при создании сессии")
        }
    }

    async getSession(id) {
        try {
            return Session.findById(id);
        } catch (error) {
            throw new Error("Ошибка при получении сессии")
        }
    }

    async deleteSession(id) {
        try {
            return Session.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Ошибка при удалении сессии")
        }
    }
}

export const sessionServices = new SessionServices();