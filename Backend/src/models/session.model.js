import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: {
            expires: 0,
        },
    },
});

export const Session = mongoose.model("Session", sessionSchema);