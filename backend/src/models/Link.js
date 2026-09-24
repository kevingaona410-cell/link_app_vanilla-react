const mongoose = require('mongoose')

const linkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        url: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },

        // Las etiquetas y los votos usan valores iniciales vacíos.
        tags: {
            type: [String],
            default: []
        },

        votes: {
            type: Number,
            default: 0
        },

        // Guarda la fecha usada para ordenar los links.
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

const Link = mongoose.model('Link', linkSchema);

module.exports = Link;