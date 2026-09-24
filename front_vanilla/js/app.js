// Obtiene los elementos del DOM que utiliza la aplicación.
const linksList = document.getElementById('links-list');
const filterForm = document.getElementById('filter-form');
const tagFilter = document.getElementById('tag-filter');
const linksView = document.getElementById('links-view');
const linkDetail = document.getElementById('link-detail');
const linkDetailTitle = document.getElementById('link-detail-title');
const linkDetailContent = document.getElementById('link-detail-content');
const backButton = document.getElementById('back-button');

// Espera a que el usuario deje de escribir antes de filtrar.
let filterTimer;

// Conserva los links recibidos para filtrar sin repetir peticiones.
let allLinks = [];

// Solicita todos los links al backend y los conserva en memoria.
async function loadLinks() {
    linksList.textContent = 'Cargando links...';

    try {
        allLinks = await getLinks();
        renderLinks(allLinks);
    } catch (error) {
        linksList.textContent = `No se pudieron cargar los links: ${error.message}`;
    }
}

// Filtra los links por texto parcial sin distinguir mayúsculas.
function filterLinks(tag = '') {
    const normalizedTag = tag.trim().toLocaleLowerCase();

    if (!normalizedTag) {
        renderLinks(allLinks);
        return;
    }

    const filteredLinks = allLinks.filter((link) => {
        return (link.tags || []).some((linkTag) => {
            return linkTag.toLocaleLowerCase().includes(normalizedTag);
        });
    });

    renderLinks(filteredLinks, 'No se encontraron links para esa etiqueta.');
}

// Convierte cada link recibido en un artículo visible.
function renderLinks(links, emptyMessage = 'Todavía no hay links.') {
    linksList.replaceChildren();

    if (links.length === 0) {
        linksList.textContent = emptyMessage;
        return;
    }

    // Agrupa temporalmente las tarjetas para agregarlas juntas al DOM.
    const fragment = document.createDocumentFragment();

    for (const link of links) {
        const article = document.createElement('article');
        const title = document.createElement('h2');
        const url = document.createElement('a');
        const tagsList = document.createElement('ul');
        const detailButton = document.createElement('button');

        // Completa el contenido de la tarjeta con los datos del link.
        title.textContent = link.title;
        url.href = link.url;
        url.textContent = link.url;

        // Muestra cada etiqueta como un botón para filtrar por ella.
        for (const tag of link.tags || []) {
            const tagItem = document.createElement('li');
            const tagButton = document.createElement('button');

            tagButton.type = 'button';
            tagButton.textContent = tag;
            tagButton.addEventListener('click', () => {
                clearTimeout(filterTimer);
                tagFilter.value = tag;
                filterLinks(tag);
            });

            tagItem.append(tagButton);
            tagsList.append(tagItem);
        }

        // Permite abrir el detalle del link seleccionado.
        detailButton.type = 'button';
        detailButton.textContent = 'Ver detalle';
        detailButton.addEventListener('click', () => loadLinkDetail(link._id));

        article.append(title, url, tagsList, detailButton);
        fragment.append(article);
    }

    linksList.append(fragment);
}

// Solicita un link específico y muestra su vista de detalle.
async function loadLinkDetail(id) {
    showLinkDetailView();
    linkDetailTitle.textContent = 'Cargando link...';
    linkDetailContent.textContent = 'Obteniendo la información del recurso...';

    try {
        const link = await getLinkById(id);
        renderLinkDetail(link);
    } catch (error) {
        linkDetailTitle.textContent = 'No se pudo cargar el link';
        linkDetailContent.textContent = error.message;
    }
}

// Construye el contenido visible de la vista de detalle.
function renderLinkDetail(link) {
    const url = document.createElement('a');
    const description = document.createElement('p');

    linkDetailTitle.textContent = link.title;
    url.href = link.url;
    url.textContent = link.url;
    description.textContent = link.description || 'Este link no tiene descripción.';

    linkDetailContent.replaceChildren(url, description);
}

// Muestra la vista de detalle y oculta el listado.
function showLinkDetailView() {
    linksView.hidden = true;
    linkDetail.hidden = false;
}

// Devuelve a la vista principal del listado.
function showLinksView() {
    linkDetail.hidden = true;
    linksView.hidden = false;
}

// Filtra los links al enviar el formulario.
filterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearTimeout(filterTimer);
    filterLinks(tagFilter.value.trim());
});

// Filtra después de 300 ms sin que el usuario siga escribiendo.
tagFilter.addEventListener('input', () => {
    clearTimeout(filterTimer);

    filterTimer = setTimeout(() => {
        filterLinks(tagFilter.value.trim());
    }, 300);
});

// Regresa al listado desde la vista de detalle.
backButton.addEventListener('click', showLinksView);

// Inicia la carga de links al abrir la aplicación.
loadLinks();

