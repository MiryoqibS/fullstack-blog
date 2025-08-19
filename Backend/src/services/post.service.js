import { Post } from "../models/Post.model.js";

export const PostsService = {
    // == Поиск всех постов ==
    async getPosts() {
        try {
            return await Post.find()
                .populate("author", "username avatar");
        } catch (error) {
            throw new Error("Ошибка при получении постов");
        };
    },

    // == Поиск поста по идентификатору ==
    async getPostById(id) {
        try {
            return await Post.findById(id)
                .populate("author", "username");
        } catch (error) {
            throw new Error("Ошибка при поиске поста");
        };
    },

    // == Поиск подледных постов ==
    async findLatestPosts() {
        try {
            return await Post.find()
                .sort({ createdAt: -1 })
                .limit(2)
                .populate("author", "username avatar");
        } catch (error) {
            throw new Error("Ошибка при поиске самых последних постов");
        };
    },

    // == Создание поста ==
    async createPost(data) {
        try {
            const { author, title, description, category, thumbnailUrl } = data;

            // Проверка на наличие обязательных полей
            if (!author) throw new Error("Автор не был передан");
            if (!title) throw new Error("Заголовок не был передан");
            if (!description) throw new Error("Описание не было передано");
            if (!category) throw new Error("Категория не была передана");
            if (!thumbnailUrl) throw new Error("URL изображения не был передан");

            return await Post.create({ author, title, description, category, thumbnailUrl });
        } catch (error) {
            throw new Error("Ошибка при создании поста");
        };
    },

    // == Обновление поста ==
    async updatePost(id, data) {
        try {
            const { title, description, category, thumbnailUrl } = data;

            // Проверка на наличие обязательных полей
            if (!title) throw new Error("Заголовок не был передан");
            if (!description) throw new Error("Описание не было передано");
            if (!category) throw new Error("Категория не была передана");
            if (!thumbnailUrl) throw new Error("URL изображения не был передан");

            return await Post.findByIdAndUpdate(id, { title, description, category, thumbnailUrl }, { new: true });
        } catch (error) {
            throw new Error("Ошибка при обновлении поста");
        };
    },

    // == Удаление поста ==
    async deletePost(id) {
        try {
            return await Post.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Ошибка при удалении поста");
        };
    },
};
