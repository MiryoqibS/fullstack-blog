import { commentServices } from "../services/comment.service.js";

export const CommentController = {
    // == Получение комментариев ==
    async getComments(req, res) {
        try {
            const postId = req.params.id;
            const comments = await commentServices.findComments(postId);
            return res.status(200).json(comments);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },

    // == Добавление комментария == 
    async addComment(req, res) {
        try {
            const text = req.body.text;
            if (!text) return res.status(400).json({ message: "текст комментария не передан" });

            const author = req.user.id;
            if (!author) return res.status(401).json({ message: "не авторизован" });
            
            const postId = req.params.id;
            if (!postId) return res.status(400).json({ message: "идентификатор поста не передан" });

            const post = await commentServices.createComment({ text, author, postId });

            return res.status(201).json(post);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },

    // == Добавление ответа комментарию ==
    async replyComment(req, res) {
        try {
            const parentCommentId = req.params.id;
            await commentServices.createReplyComment({
                parentCommentId,
                authorId: req.user.id,
                ...req.body,
            });

            return res.status(201).json({ message: "ваш комментарий добавлен" });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },
};
