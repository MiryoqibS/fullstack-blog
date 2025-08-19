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
            const author = req.user.id;
            const postId = req.params.id;

            const post = await commentServices.createComment({ text, author, postId });

            return res.status(201).json(post);
        } catch (error) {
            return res.status(400).json({ message: error.message });
        };
    },
};
