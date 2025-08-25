import { PostsService } from "../services/post.service.js";

export const PostController = {
    // == Получение постов ==
    async getPosts(req, res) {
        try {
            const posts = await PostsService.getPosts();
            return res.status(200).json(posts);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },

    // == Получение поста по идентификатору ==
    async getPost(req, res) {
        try {
            const post = await PostsService.getPostById(req.params.id);
            return res.status(200).json(post);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },

    // == Создание поста ==
    async createPost(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "Изображение не загружено" });
            };

            const { title, description, category } = req.body;
            const author = req.user.id;
            const post = await PostsService.createPost({
                author,
                title,
                description,
                category,
                thumbnailUrl: `http://192.168.100.151:5000/storage/posts/${req.file.filename}`,
            });
            return res.status(201).json(post);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },

    // == Обновлении поста ==
    async updatePost(req, res) {
        try {
            const updatedPost = await PostsService.updatePost(req.params.id, req.body);
            return res.status(200).json({
                message: "Пост был успешно изменён",
                post: updatedPost
            });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },

    // == Удаление поста ==
    async deletePost(req, res) {
        try {
            await PostsService.deletePost(req.params.id);
            return res.status(200).json({ message: "Пост был успешно удалён" })
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },

    // == Получение последних постов ==
    async getLatestPosts(req, res) {
        try {
            const latestPosts = await PostsService.findLatestPosts();
            return res.status(200).json(latestPosts);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },
};

