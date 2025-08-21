// Утилита для работы с запросами
import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const Api = {
    // == Регистрация ==
    async register(data) {
        const response = await instance.post("/user/register", data);
        return response
    },

    // == Авторизация ==
    async login(data) {
        const response = await instance.post("/user/login", data, {
            withCredentials: true
        });

        return response;
    },

    // == Проверка авторизован ли пользователь ==
    async checkAuth() {
        const response = await instance.get("/user/isAuth", {
            withCredentials: true,
        });
        const data = response.data;
        return data.isAuth;
    },

    // == Получение профиля пользователя ==
    async getProfile() {
        const response = await instance.get("/user/profile");
        return response.data;
    },

    // == Получение имя пользователя если он авторизован
    async getUsername() {
        const response = await instance.get("/user/profile");
        const data = response.data;
        return data.username;
    },

    // == Получение роли пользователя если он авторизован
    async getRole() {
        const response = await instance.get("/user/profile");
        const data = response.data;
        return data.role;
    },

    // == Обновление фото профиля ==
    async updateAvatar(data) {
        const response = await instance.post("/user/avatar", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        });

        return response;
    },

    // == Поиск всех постов ==
    async getPosts() {
        const response = await instance.get("/posts");
        return response.data;
    },

    // == Создание нового поста ==
    async createPost(data) {
        const response = await instance.post("/posts", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response;
    },

    // == Поиск поста по идентификатору ==
    async getPost(postId) {
        const response = await instance.get(`/posts/${postId}`);
        return response.data;
    },

    // == Поиск самых последних постов ==
    async getLatestPosts() {
        const response = await instance.get("/posts/latest");
        return response.data;
    },

    // == Поиск комментариев поста ==
    async getComments(postId) {
        const response = await instance.get(`/comments/${postId}`);

        return response.data;
    },

    // == Запрос для создания комментария ==
    async addComment(postId, text) {
        const response = await instance.post(`/comments/${postId}`, {
            text,
        });

        return response;
    },

    // == Запрос для ответа комментарию ==
    async replyComment(parentCommentId, postId, text) {
        const response = await instance.post(`/comments/reply/${parentCommentId}`, {
            text,
            postId,
        });

        return response.data;
    },
};