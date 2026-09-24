const mongoose = require('mongoose');
const Link = require('../models/Link');
const { createNotFound } = require('../helpers/errors');

// controlador para obtener links por filtro GET /api/links
async function getLinks(req, res, next) {
    try {
        const { tag } = req.query;

        const filter = tag ? { tags: tag } : {};

        const links = await Link.find(filter)
            .sort({ createdAt: -1 });

        res.status(200).json(links);
    } catch (error) {
        next(error);
    }
}

// controlador para obtener un link especifico GET /api/links/:id
async function getLink(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Link'));
        }

        const link = await Link.findById(req.params.id);

        if (!link) {
            return next(createNotFound('Link'));
        }

        res.status(200).json(link);
    } catch (error) {
        next(error);
    }
}

// controlador para crear links POST /api/links
async function createLink(req, res, next) {
    try {
        const link = await Link.create(req.body);

        res.status(201).json(link);
    } catch (error) {
        next(error);
    }
}

// controlador modificar un link PUT /api/links/:id
async function updateLink(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Link'));
        }

        const link = await Link.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!link) {
            return next(createNotFound('Link'));
        }

        res.status(200).json(link);
    } catch (error) {
        next(error);
    }
}

// controlador para borrar links DELETE /api/links/:id
async function deleteLink(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Link'));
        }

        const link = await Link.findByIdAndDelete(req.params.id);

        if (!link) {
            return next(createNotFound('Link'));
        }

        res.status(200).json({
            message: 'Link deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}

// controlador para votar links POST /api/links/:id/vote
async function voteLink(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return next(createNotFound('Link'));
        }

        const link = await Link.findByIdAndUpdate(
            req.params.id,
            { $inc: { votes: 1 } },
            { new: true }
        );

        if (!link) {
            return next(createNotFound('Link'));
        }

        res.status(200).json(link);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getLinks,
    getLink,
    createLink,
    updateLink,
    deleteLink,
    voteLink,
};