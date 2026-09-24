const mongoose = require('mongoose');
const Link = require('../models/Link');
const Comment = require('../models/Comment')
const { createNotFound, createBadRequest } = require('../helpers/errors');


// Obtiene comentarios de un link: GET /api/links/:id/comments
async function getComments(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Link'));
        }

        // Verifica que el link exista antes de consultar sus comentarios.
        const link = await Link.findById(req.params.id);

        if (!link) {
            return next(createNotFound('Link'));
        }

        // Devuelve los comentarios del más nuevo al más antiguo.
        const comments = await Comment.find({
            link: req.params.id
        }).sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}

// Crea un comentario: POST /api/links/:id/comments
async function createComment(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Link'));
        }

        // Evita comentarios huérfanos validando el link de la ruta.
        const link = await Link.findById(req.params.id);

        if (!link) {
            return next(createNotFound('Link'));
        }

        const { author, content } = req.body;

        // Valida autor y contenido antes de persistir el comentario.
        if (!author || !content) {
            return next(
                createBadRequest('Author and content are required')
            );
        }

        // Asocia el comentario con el link indicado en la URL.
        const comment = await Comment.create({
            link: req.params.id,
            author,
            content
        });

        res.status(201).json(comment);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getComments,
    createComment
};
