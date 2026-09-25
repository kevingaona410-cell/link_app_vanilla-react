// Obtiene los elementos del DOM que utiliza la aplicación.
const linksList = document.getElementById('links-list');
const filterForm = document.getElementById('filter-form');
const tagFilter = document.getElementById('tag-filter');
const linksView = document.getElementById('links-view');
const linkDetail = document.getElementById('link-detail');
const linkDetailTitle = document.getElementById('link-detail-title');
const linkDetailContent = document.getElementById('link-detail-content');
const backButton = document.getElementById('back-button');
const createLinkForm = document.getElementById('create-link-form');
const createLinkMessage = document.getElementById('create-link-message');

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
        const votes = document.createElement('span');
        const voteButton = document.createElement('button');

        // Completa el contenido de la tarjeta con los datos del link.
        title.textContent = link.title;
        url.href = link.url;
        url.textContent = link.url;
        url.target = '_blank';
        url.rel = 'noopener noreferrer';

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

        // Muestra contador de votos y botón para votar.
        // Se actualiza link.votes además del DOM para que un re-render por filtro conserve el valor.
        votes.textContent = `Votos: ${link.votes ?? 0}`;
        voteButton.type = 'button';
        voteButton.textContent = 'Votar';

        voteButton.addEventListener('click', async () => {
            voteButton.disabled = true;

            try {
                const updatedLink = await voteLink(link._id);
                link.votes = updatedLink.votes;
                votes.textContent = `Votos: ${link.votes}`;
            } catch (error) {
                votes.textContent = `Votos: ${link.votes ?? 0} (error al votar)`;
                console.error(error);
            } finally {
                voteButton.disabled = false;
            }
        });

        // Permite abrir el detalle del link seleccionado.
        detailButton.type = 'button';
        detailButton.textContent = 'Ver detalle';
        detailButton.addEventListener('click', () => loadLinkDetail(link._id));

        article.append(title, url, tagsList, votes, voteButton, detailButton);
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
// Incluye: título, url, descripción, votos con botón, comentarios y formulario.
function renderLinkDetail(link) {
    linkDetailTitle.textContent = link.title;
    linkDetailContent.replaceChildren();

    const url = document.createElement('a');
    const description = document.createElement('p');
    const votes = document.createElement('p');
    const voteButton = document.createElement('button');
    const voteMessage = document.createElement('p');

    url.href = link.url;
    url.textContent = link.url;
    url.target = '_blank';
    url.rel = 'noopener noreferrer';
    description.textContent = link.description || 'Este link no tiene descripción.';
    votes.textContent = `Votos: ${link.votes ?? 0}`;
    voteButton.type = 'button';
    voteButton.textContent = 'Votar';
    voteMessage.setAttribute('aria-live', 'polite');

    voteButton.addEventListener('click', async () => {
        voteButton.disabled = true;
        voteMessage.textContent = '';

        try {
            const updatedLink = await voteLink(link._id);
            link.votes = updatedLink.votes;
            votes.textContent = `Votos: ${link.votes}`;

            // Sincroniza el estado local para que el listado refleje el nuevo voto al volver.
            const localLink = allLinks.find((item) => item._id === link._id);
            if (localLink) {
                localLink.votes = updatedLink.votes;
            }
        } catch (error) {
            voteMessage.textContent = `No se pudo votar: ${error.message}`;
        } finally {
            voteButton.disabled = false;
        }
    });

    // Sección de comentarios
    const commentsSection = document.createElement('section');
    const commentsTitle = document.createElement('h3');
    const commentsStatus = document.createElement('p');
    const commentsList = document.createElement('div');

    commentsTitle.textContent = 'Comentarios';
    commentsStatus.textContent = 'Cargando comentarios...';
    commentsStatus.setAttribute('aria-live', 'polite');
    commentsList.setAttribute('aria-live', 'polite');

    // Formulario para crear comentario
    const commentForm = document.createElement('form');
    const authorLabel = document.createElement('label');
    const authorInput = document.createElement('input');
    const contentLabel = document.createElement('label');
    const contentInput = document.createElement('textarea');
    const submitButton = document.createElement('button');
    const formMessage = document.createElement('p');

    authorLabel.htmlFor = 'comment-author';
    authorLabel.textContent = 'Nombre';
    authorInput.id = 'comment-author';
    authorInput.name = 'author';
    authorInput.required = true;
    authorInput.placeholder = 'Tu nombre';
    authorInput.type = 'text';

    contentLabel.htmlFor = 'comment-content';
    contentLabel.textContent = 'Comentario';
    contentInput.id = 'comment-content';
    contentInput.name = 'content';
    contentInput.required = true;
    contentInput.placeholder = 'Escribe tu comentario...';

    submitButton.type = 'submit';
    submitButton.textContent = 'Enviar comentario';
    formMessage.setAttribute('aria-live', 'polite');

    commentForm.append(authorLabel, authorInput, contentLabel, contentInput, submitButton, formMessage);
    commentsSection.append(commentsTitle, commentsStatus, commentsList, commentForm);

    linkDetailContent.append(url, description, votes, voteButton, voteMessage, commentsSection);

    // Carga comentarios sin bloquear el resto del detalle.
    loadCommentsForDetail(link._id, commentsList, commentsStatus);

    commentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        formMessage.textContent = '';

        const author = authorInput.value.trim();
        const content = contentInput.value.trim();

        if (!author || !content) {
            formMessage.textContent = 'Completa nombre y comentario.';
            return;
        }

        submitButton.disabled = true;

        try {
            const newComment = await createComment(link._id, { author, content });
            formMessage.textContent = 'Comentario agregado.';
            authorInput.value = '';
            contentInput.value = '';

            // Inserta el nuevo comentario arriba sin recargar todo el listado.
            if (commentsList.textContent === 'Todavía no hay comentarios.') {
                commentsList.replaceChildren();
            }

            const commentElement = createCommentElement(newComment);
            // Si hay placeholder de vacío, reemplazar; si no, prepend.
            if (commentsList.childElementCount === 0 && commentsList.textContent) {
                commentsList.replaceChildren(commentElement);
            } else {
                commentsList.prepend(commentElement);
            }

            commentsStatus.textContent = '';
        } catch (error) {
            formMessage.textContent = `No se pudo crear el comentario: ${error.message}`;
        } finally {
            submitButton.disabled = false;
        }
    });
}

// Crea el elemento DOM para un comentario.
function createCommentElement(comment) {
    const article = document.createElement('article');
    const author = document.createElement('p');
    const content = document.createElement('p');
    const date = document.createElement('small');

    author.textContent = comment.author;
    content.textContent = comment.content;
    date.textContent = comment.createdAt
        ? new Date(comment.createdAt).toLocaleString('es')
        : '';

    article.append(author, content, date);
    return article;
}

// Obtiene y renderiza los comentarios del link en detalle.
async function loadCommentsForDetail(linkId, commentsList, commentsStatus) {
    try {
        const comments = await getComments(linkId);
        commentsStatus.textContent = '';

        if (comments.length === 0) {
            commentsList.textContent = 'Todavía no hay comentarios.';
            return;
        }

        commentsList.replaceChildren();
        for (const comment of comments) {
            commentsList.append(createCommentElement(comment));
        }
    } catch (error) {
        commentsStatus.textContent = `No se pudieron cargar los comentarios: ${error.message}`;
    }
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

// Crea links desde el formulario de la vista de listado.
if (createLinkForm) {
    createLinkForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (createLinkMessage) createLinkMessage.textContent = '';

        const formData = new FormData(createLinkForm);
        const title = String(formData.get('title') || '').trim();
        const url = String(formData.get('url') || '').trim();
        const description = String(formData.get('description') || '').trim();
        const tagsRaw = String(formData.get('tags') || '').trim();

        if (!title || !url) {
            if (createLinkMessage) createLinkMessage.textContent = 'Título y URL son obligatorios.';
            return;
        }

        const tags = tagsRaw
            ? tagsRaw.split(',').map((tag) => tag.trim()).filter(Boolean)
            : [];

        const submitButton = createLinkForm.querySelector('button[type="submit"]');
        if (submitButton) submitButton.disabled = true;

        try {
            const newLink = await createLink({ title, url, description, tags });
            // Agrega al inicio porque el backend ordena por createdAt descendente.
            allLinks.unshift(newLink);

            // Respeta el filtro activo: si hay filtro, re-aplica; si no, muestra todo.
            if (tagFilter.value.trim()) {
                filterLinks(tagFilter.value.trim());
            } else {
                renderLinks(allLinks);
            }

            createLinkForm.reset();
            if (createLinkMessage) createLinkMessage.textContent = 'Link creado correctamente.';
        } catch (error) {
            if (createLinkMessage) createLinkMessage.textContent = `No se pudo crear el link: ${error.message}`;
        } finally {
            if (submitButton) submitButton.disabled = false;
        }
    });
}

// Inicia la carga de links al abrir la aplicación.
loadLinks();
