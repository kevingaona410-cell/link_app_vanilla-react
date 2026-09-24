const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        // Cada comentario referencia el link al que pertenece.
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
    // Mongoose gestiona automáticamente createdAt y updatedAt.
    { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);