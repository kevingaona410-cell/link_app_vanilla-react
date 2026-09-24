// Configuración de la API y del contenedor principal del listado.
const API_URL = 'http://localhost:3000/api/links';
const linksList = document.getElementById('links-list');

// Solicita los links al backend y manages la respuesta.
async function loadLinks() {
    linksList.textContent = 'Cargando links...';

    try {
        // Envía la petición GET y espera la respuesta del servidor.
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        // Convierte la respuesta JSON en un arreglo de links.
        const links = await response.json();
        renderLinks(links);
    } catch (error) {
        linksList.textContent = `No se pudieron cargar los links: ${error.message}`;         // Muestra un mensaje visible si la consulta no puede completarse.
    }
}

// Convierte cada link recibido en un artículo visible.
function renderLinks(links) {
    linksList.replaceChildren();                // Elimina el contenido anterior del contenedor.

    if (links.length === 0) {
        linksList.textContent = 'Todavía no hay links.';
        return;
    }

    const fragment = document.createDocumentFragment();                 // Agrupa temporalmente las tarjetas para agregarlas juntas al DOM.

    for (const link of links) {
        const article = document.createElement('article');
        const title = document.createElement('h2');
        const url = document.createElement('a');

        // Completa el contenido de la tarjeta con los datos del link.
        title.textContent = link.title;
        url.href = link.url;
        url.textContent = link.url;

        // Agrega el título y la URL dentro de la tarjeta.
        article.append(title, url);
        fragment.append(article);
    }

    // Inserta todas las tarjetas en el listado visible.
    linksList.append(fragment);
}

// Inicia la carga de links al abrir la aplicación.
loadLinks();

