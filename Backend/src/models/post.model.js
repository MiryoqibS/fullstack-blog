import mongoose from "mongoose";

const postScheme = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
});

export const Post = mongoose.model("Post", postScheme);