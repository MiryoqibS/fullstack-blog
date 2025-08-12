import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    replies: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Comment",
        default: [],
    },
});

export default mongoose.model("Comment", commentSchema);