const API_URL = 'http://localhost:3000/api/links';

// Obtiene todos los links.
async function getLinks() {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}

// Obtiene un link específico por su ID.
async function getLinkById(id) {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}

// Crea un nuevo link.
async function createLink(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}

// Registra un voto para un link.
async function voteLink(id) {
    const response = await fetch(`${API_URL}/${id}/vote`, {
        method: 'POST'
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}

// Obtiene los comentarios de un link.
async function getComments(id) {
    const response = await fetch(`${API_URL}/${id}/comments`);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}

// Crea un comentario para un link.
async function createComment(id, data) {
    const response = await fetch(`${API_URL}/${id}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}


export {
    getLinks,
    getLinkById,
    createLink,
    voteLink,
    getComments,
    createComment
};
