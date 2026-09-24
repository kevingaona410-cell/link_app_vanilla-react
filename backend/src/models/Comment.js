const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        link: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Link',
            required: true
        },
        author: {
            type: String,
            required: true,
            trim: true
        },
        content: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);