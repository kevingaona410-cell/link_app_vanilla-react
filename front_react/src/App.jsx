// Importa los hooks que permiten guardar estado y sincronizar React con la API.
import { useEffect, useState } from 'react'

// Importa las funciones que se comunican con el backend.
import { createLink, getLinkById, getLinks, voteLink } from './api'

// Importa el formulario que crea links.
import CreateLinkForm from './components/CreateLinkForm'

// Importa la vista de detalle del link.
import LinkDetail from './components/LinkDetail'

// Importa el componente que recibe el arreglo y crea las tarjetas.
import LinkList from './components/LinkList'

// Importa el buscador de etiquetas.
import TagFilter from './components/TagFilter'

// Importa los estilos específicos de App.
import './App.css'

// Guarda la clave de los votos realizados durante esta sesión del navegador.
const VOTED_LINKS_STORAGE_KEY = 'wikinguin-voted-links'

// Declara el componente principal de la aplicación React.
function App() {
  // Conserva los links en un arreglo y sus funciones para actualizarlo.
  // links guarda los datos y setLinks permite reemplazarlos o modificarlos.
  const [links, setLinks] = useState([])

  // Indica si la petición inicial de links todavía está en curso.
  // loading cambia para que React muestre el mensaje de carga o el contenido.
  const [loading, setLoading] = useState(true)

  // Guarda el mensaje de error de la carga principal.
  // error comienza vacío y se llena dentro de catch.
  const [error, setError] = useState('')

  // Guarda el texto que el usuario escribe en el filtro de etiquetas.
  // filter se actualiza desde TagFilter mediante onChange.
  const [filter, setFilter] = useState('')

  // Guarda el link abierto actualmente en la vista de detalle.
  // selectedLink determina si App muestra el detalle o el listado.
  const [selectedLink, setSelectedLink] = useState(null)

  // Indica que se está consultando el detalle de un link.
  const [detailLoading, setDetailLoading] = useState(false)

  // Guarda el error producido al consultar un detalle.
  const [detailError, setDetailError] = useState('')

  // Guarda el ID del link que se está voteando para bloquear el botón.
  const [votingId, setVotingId] = useState('')

  // Guarda el mensaje de error producido al votar.
  const [voteError, setVoteError] = useState('')

  // Recupera los IDs votados en esta pestaña, sin permitir almacenamiento persistente.
  const [votedIds, setVotedIds] = useState(() => {
    try {
      const saved = sessionStorage.getItem(VOTED_LINKS_STORAGE_KEY)
      const parsedIds = saved ? JSON.parse(saved) : []
      return Array.isArray(parsedIds) ? parsedIds : []
    } catch {
      return []
    }
  })

  // Elimina espacios exteriores y convierte el filtro a minúsculas.
  const normalizedFilter = filter.trim().toLocaleLowerCase()

  // Comprueba si existe un filtro activo.
  // Si existe, filtra los tags de cada link; si no, usa todos los links.
  const visibleLinks = normalizedFilter
    ? links.filter((link) =>
        // Busca una etiqueta que contenga el texto buscado.
        link.tags?.some((tag) =>
          // Compara la etiqueta en minúsculas con el filtro normalizado.
          tag.toLocaleLowerCase().includes(normalizedFilter)
        )
      )
    // Sin filtro, el listado visible es el listado completo.
    : links

  // Ejecuta esta lógica cuando App se monta por primera vez.
  useEffect(() => {
    // Declara la función asíncrona que carga los links.
    async function loadLinks() {
      // Intenta obtener los links desde la API.
      try {
        // Espera la respuesta JSON del backend.
        const data = await getLinks()

        // Guarda el arreglo recibido en el estado de App.
        setLinks(data)
      } catch {
        // Si la API falla, guarda un mensaje para mostrarlo al usuario.
        setError('No se pudieron cargar los links.')
      } finally {
        // La carga terminó, tanto con éxito como con error.
        setLoading(false)
      }
    }

    // Inicia la carga después de montar el componente.
    loadLinks()

    // El arreglo vacío indica que este efecto se ejecuta una sola vez.
  }, [])

  // Crea un link usando la API y lo agrega al principio del listado.
  async function handleCreateLink(data) {
    // Envía los datos del formulario al backend.
    const newLink = await createLink(data)

    // Actualiza el estado usando la versión más reciente del arreglo.
    setLinks((currentLinks) => [newLink, ...currentLinks])
  }

  // Consulta un link por su ID y activa la vista de detalle.
  async function handleSelectLink(id) {
    // Cierra el detalle anterior mientras carga el nuevo.
    setSelectedLink(null)

    // Limpia errores de detalles y votos anteriores.
    setDetailError('')
    setVoteError('')

    // Activa el estado de carga del detalle.
    setDetailLoading(true)

    try {
      // Solicita el link seleccionado al backend.
      const link = await getLinkById(id)

      // Guarda el link recibido para que React muestre el detalle.
      setSelectedLink(link)
    } catch {
      // Guarda el error si el link no puede consultarse.
      setDetailError('No se pudo cargar el link.')
    } finally {
      // Termina la carga del detalle.
      setDetailLoading(false)
    }
  }

  // Vota un link y sincroniza el resultado en las dos vistas.
  async function handleVote(id) {
    // Bloquea votos simultáneos o repetidos en la misma sesión.
    if (votingId || votedIds.includes(id)) return

    // Guarda el ID que se está procesando.
    setVotingId(id)

    // Limpia el error de voto anterior.
    setVoteError('')

    try {
      // Envía el voto al backend y recibe el link actualizado.
      const updatedLink = await voteLink(id)

      // Actualiza únicamente el link que coincide con el ID.
      setLinks((currentLinks) =>
        currentLinks.map((link) =>
          link._id === id
            ? { ...link, votes: updatedLink.votes }
            : link
        )
      )

      // Actualiza también el link abierto en el detalle.
      setSelectedLink((currentLink) =>
        currentLink?._id === id
          ? { ...currentLink, votes: updatedLink.votes }
          : currentLink
      )

      // Guarda el voto únicamente cuando el backend lo confirmó.
      setVotedIds((currentIds) => {
        const nextIds = [...currentIds, id]
        try {
          sessionStorage.setItem(VOTED_LINKS_STORAGE_KEY, JSON.stringify(nextIds))
        } catch {
          // Si el navegador bloquea sessionStorage, el estado de React sigue funcionando.
        }
        return nextIds
      })
    } catch {
      // Guarda el error si el backend no acepta el voto.
      setVoteError('No se pudo registrar el voto.')
    } finally {
      // Libera el bloqueo del botón de voto.
      setVotingId('')
    }
  }

  // Cierra el detalle y regresa al listado.
  function handleBack() {
    // Elimina el link seleccionado.
    setSelectedLink(null)

    // Limpia errores de la vista anterior.
    setDetailError('')
    setVoteError('')
  }

  // Devuelve el JSX que React dibuja en pantalla.
  return (
    // Contenedor principal de la aplicación.
    <main className="app">
      {/* Título visible de Wikinguin. */}
      <h1>Wikinguin</h1>

      {/* El estado decide si se muestra el detalle o el listado. */}
      {selectedLink ? (
        /* Props: link, onBack, onVote, isVoting y voteError. */
        <LinkDetail
          link={selectedLink}
          onBack={handleBack}
          onVote={handleVote}
          isVoting={votingId === selectedLink._id}
          hasVoted={votedIds.includes(selectedLink._id)}
          voteError={voteError}
        />
      ) : detailLoading ? (
        /* Mensaje temporal mientras se consulta el detalle. */
        <p>Cargando detalle...</p>
      ) : detailError ? (
        /* Vista de error del detalle con acción para volver. */
        <div>
          <p role="alert">{detailError}</p>
          <button type="button" onClick={handleBack}>← Volver</button>
        </div>
      ) : (
        /* Vista principal cuando no hay un detalle abierto. */
        <>
          {/* El filtro es controlado por App. */}
          <TagFilter
            value={filter}
            onChange={setFilter}
          />

          {/* Organiza el formulario y el listado en dos columnas. */}
          <div className="content-grid">
            {/* Formulario controlado para crear un link. */}
            <CreateLinkForm onCreate={handleCreateLink} />

            {/* Columna que contiene estados y resultados del listado. */}
            <div className="links-column">
              {/* Mensaje mientras se obtienen los links iniciales. */}
              {loading && <p>Cargando links...</p>}

              {/* Mensaje de error de la carga inicial. */}
              {error && <p role="alert">{error}</p>}

              {/* Mensaje de error de los votos. */}
              {voteError && <p role="alert">{voteError}</p>}

              {/* Muestra el listado solo cuando no hay carga ni error. */}
              {!loading && !error && (
                /* Props: links, onSelect, onVote, votingId y onTagClick. */
                <LinkList
                  links={visibleLinks}
                  onSelect={handleSelectLink}
                  onVote={handleVote}
                  votingId={votingId}
                  votedIds={votedIds}
                  onTagClick={setFilter}
                />
              )}
            </div>
          </div>
        </>
      )}
    </main>
  )
}

// Exporta App para que main.jsx pueda montarlo.
export default App