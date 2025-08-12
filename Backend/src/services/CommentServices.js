import Comment from "../models/Comment.js";

class CommentServices {
    async createComment({ author, text, postId }) {
        try {
            if (!author) throw new Error("Автор комментария не передан");
            if (!text) throw new Error("Текста комментария не передан");
            if (!postId) throw new Error("Идентификатор поста не передан");

            return await Comment.create({ author, text, postId });
        } catch (error) {
            throw new Error("Ошибка при создании комментария");
        }
    }

    async createReplyComment(author, text, parentCommentId) {

    }

    async findComments(postId) {
        try {
            const comments = await Comment.find({ postId })
                .select("-_id, -__v")
                .populate("author", "username -_id")
                .lean();
            
            const cleanComments = comments.map(comment => ({
                ...comment,
                author: comment.author.username,
            }));

            return cleanComments;
        } catch (error) {
            throw new Error("Ошибка при поиске комментариев поста");
        }
    }

    async deleteComment(id) {
        try {
            await Comment.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Ошибка при удалении поста");
        }
    }

    async findReplies(commentId) {
        try {
            return await Comment.findById(commentId)
                .populate("replies");
        } catch (error) {
            throw new Error("Ошибка при поиске ответов комментария");
        }
    }

    async updateComment(id, text) {
        try {
            return await Comment.findByIdAndUpdate(id, { text }, { new: true });
        } catch (error) {
            throw new Error("Ошибка при редактирование поста");
        }
    }
}

export const commentServices = new CommentServices();