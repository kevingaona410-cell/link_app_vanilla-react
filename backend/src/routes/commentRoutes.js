const router = require('express').Router();

const commentController = require('../controllers/commentController');

// Obtener comentarios de un link
router.get('/:id/comments', commentController.getComments);

// Crear comentario
router.post('/:id/comments', commentController.createComment);

module.exports = router;