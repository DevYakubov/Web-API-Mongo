const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String
    },
    likeCount: {
        type: Number
    },
    likes: {
        type: Array
    },
    commentCount: {
        type: Date
    },
    comments: {
        type: Array
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

const Post = mongoose.model("post", PostSchema);

module.exports = { Post };
