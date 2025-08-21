import { Comment } from "../models/comment.model.js";
import { PostsService } from "./post.service.js";
import { UserService } from "./user.service.js";

class CommentServices {
    // == Создание обычного комментария под постом ==
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

    // == Создание ответного комментария ==
    async createReplyComment({ parentCommentId, authorId, text, postId }) {
        try {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) throw new Error("родительский комментарий не был найден");

            const author = await UserService.findUserById(authorId);
            if (!author) throw new Error("автор комментария не был найден");

            if (!text || text.trim().length === 0) throw new Error("текст комментария не был передан");

            const post = await PostsService.getPostById(postId);
            if (!post) throw new Error("пост не был найден");

            const replyComment = await Comment.create({
                replyTo: parentComment._id,
                author: author._id,
                postId: post._id,
                text,
            });

            parentComment.replies.push(replyComment._id);
            await parentComment.save();
            return replyComment
        } catch (error) {
            throw new Error("Ошибка при создании ответного комментария");
        };
    }

    // == Поиск комментариев по идентификатору поста ==
    async findComments(postId) {
        try {
            const comments = await Comment.find({ postId })
                .select("-_id, -__v")
                .populate("author", "username avatar -_id")
                .populate({
                    path: "replies",
                    select: "-__v",
                    populate: {
                        path: "author",
                        select: "username avatar -_id",
                    },
                })
                .lean();

            const cleanComments = comments.map(comment => ({
                ...comment,
                author: comment.author,
            }));

            return cleanComments;
        } catch (error) {
            throw new Error("Ошибка при поиске комментариев поста");
        };
    }

    // == Удаления комментария по идентификатору ==
    async deleteComment(id) {
        try {
            await Comment.findByIdAndDelete(id);
        } catch (error) {
            throw new Error("Ошибка при удалении поста");
        };
    }

    // == Поиск ответов других пользователей ==
    async findReplies(commentId) {
        try {
            return await Comment.findById(commentId)
                .populate("replies");
        } catch (error) {
            throw new Error("Ошибка при поиске ответов комментария");
        };
    }

    // == Обновление комментария ==
    async updateComment(id, text) {
        try {
            return await Comment.findByIdAndUpdate(id, { text }, { new: true });
        } catch (error) {
            throw new Error("Ошибка при редактирование поста");
        };
    }
};

export const commentServices = new CommentServices();