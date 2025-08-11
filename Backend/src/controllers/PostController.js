import { postServices } from "../services/PostServices.js";

export const getPosts = async (req, res) => {
    try {
        const posts = await postServices.getPosts();
        return res.status(200).json(posts);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

export const getPost = async (req, res) => {
    try {
        const post = await postServices.getPostById(req.params.id);

        return res.status(200).json({ post });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

export const createPost = async (req, res) => {
    try {
        const { title, description, category, thumbnailUrl } = req.body;
        const author = req.user._id;
        const post = await postServices.createPost({
            author,
            title,
            description,
            category,
            thumbnailUrl,
        });
        return res.status(201).json(post);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка сервера" });
    };
};

export const updatePost = async (req, res) => {
    try {
        const updatedPost = await postServices.updatePost(req.params.id, req.body);
        return res.status(200).json({
            message: "Пост был успешно изменён",
            post: updatedPost
        });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};

export const deletePost = async (req, res) => {
    try {
        await postServices.deletePost(req.params.id);
        return res.status(200).json({ message: "Пост был успешно удалён" })
    } catch (error) {
        return res.status(400).json({ message: error.message });
    };
};