// Crea errores con el estado HTTP que consumirá el middleware global.
function createNotFound(resource) {
    const error = new Error(`${resource} no encontrado`);
    error.status = 404;
    return error;
}

function createBadRequest(message) {
    const error = new Error(message);
    error.status = 400;
    return error;
}

module.exports = {
    createNotFound,
    createBadRequest
};