import { commentServices } from "../services/CommentServices.js";

// Получение комментариев
export const getComments = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await commentServices.findComments(postId);
        return res.status(200).json(comments);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

// Добавление комментария
export const addComment = async (req, res) => {
    try {
        const text = req.body.text;
        const author = req.user.id;
        const postId = req.params.id;

        const post = await commentServices.createComment({ text, author, postId });

        return res.status(201).json(post);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};