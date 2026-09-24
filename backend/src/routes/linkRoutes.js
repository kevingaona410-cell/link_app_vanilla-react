const router = require('express').Router();

const linkController = require('../controllers/linkController');

// Obtener todos los links
router.get('/', linkController.getLinks);

// Obtener un link
router.get('/:id', linkController.getLink);

// Crear un link
router.post('/', linkController.createLink);

// Actualizar un link
router.put('/:id', linkController.updateLink);

// Borrar un link
router.delete('/:id', linkController.deleteLink);

// Votar un link
router.post('/:id/vote', linkController.voteLink);

module.exports = router;