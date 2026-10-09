import { useEffect, useState } from 'react'   // Importa los hooks que permiten guardar estado y sincronizar React con la API.
import { createLink, deleteLink, getLinkById, getLinks, voteLink} from './api' // Importa las funciones que se comunican con el backend.

// Importar los componentes hijos
import CreateLinkForm from './components/CreateLinkForm' 
import LinkDetail from './components/LinkDetail'
import LinkList from './components/LinkList'
import TagFilter from './components/TagFilter'

// Importa los estilos específicos de App.
import './App.css'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify' // Importa el estilo para el toastify
import 'react-toastify/dist/ReactToastify.css'

// Declara el componente principal de la aplicación React.
function App() {
  const [links, setLinks] = useState([])    // Conserva los links en un arreglo y sus funciones para actualizarlo.
  const [loading, setLoading] = useState(true)    // Indica si la petición inicial de links todavía está en curso.
  const [error, setError] = useState('')    // Guarda el mensaje de error de la carga principal.
  const [filter, setFilter] = useState('')      // Guarda el texto que el usuario escribe en el filtro de etiquetas.
  const [selectedLink, setSelectedLink] = useState(null)      // Guarda el link abierto actualmente en la vista de detalle.
  const [detailLoading, setDetailLoading] = useState(false)   // Indica que se está consultando el detalle de un link.
  const [detailError, setDetailError] = useState('')      // Guarda el error producido al consultar un detalle.
  const [votingId, setVotingId] = useState('')      // Guarda el ID del link que se está voteando para bloquear el botón.

  // Recupera los IDs votados en esta pestaña, sin permitir almacenamiento persistente.
  const [votedIds, setVotedIds] = useState(() => {
    try {
      const saved = sessionStorage.getItem('wikinguin-voted-links')
      const parsedIds = saved ? JSON.parse(saved) : []
      return Array.isArray(parsedIds) ? parsedIds : []
    } catch {
      return []
    }
  })


  const [pinnedIds, setPinnedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('wikinguin-pinned-links')
      const parsed = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed) ? parsed : []    
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


  const sortedLinks = [...visibleLinks].sort((a, b) =>
    (pinnedIds.includes(b._id) - pinnedIds.includes(a._id)) ||
    ((b.votes ?? 0) - (a.votes ?? 0))
)
  // Ejecuta esta lógica cuando App se monta por primera vez.
  useEffect(() => {
    // Declara la función asíncrona que carga los links.
    async function loadLinks() {
      // Limpia el error anterior antes de reintentar.
      setError('')
      // Intenta obtener los links desde la API.
      try {
        // Espera la respuesta JSON del backend.
        const data = await getLinks()

        // Guarda el arreglo recibido en el estado de App.
        setLinks(data)
      } catch {
        // Si la API falla, guarda un mensaje para mostrarlo al usuario.
        setError('No se pudieron cargar los links.')
        toast.error('No se pudieron cargar los links.')
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

  async function handleDeleteLink(id) {
    const confirmed = window.confirm('seguro que desea eliminar este link?');

    if (!confirmed) return;

    try {
      await deleteLink(id)

      setLinks((currentLinks) => currentLinks.filter((link) => link._id !== id))
      setPinnedIds((current) => {
        const next = current.filter((pinnedId) => pinnedId !== id)
        try {
          localStorage.setItem('wikinguin-pinned-links', JSON.stringify(next))
        } catch {}
        return next
      })
      setVotedIds((current) => {
        const next = current.filter((votedId) => votedId !== id)
        try {
          sessionStorage.setItem('wikinguin-voted-links', JSON.stringify(next))
        } catch {}
        return next
      })
      toast.success('Link borrado correctamente')
    } catch {
      toast.error('No se pudo eliminar el link')
    }
  }

  // Consulta un link por su ID y activa la vista de detalle.
  async function handleSelectLink(id) {
    // Cierra el detalle anterior mientras carga el nuevo.
    setSelectedLink(null)

    // Limpia el error de detalle anterior.
    setDetailError('')
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
      toast.error('No se pudo cargar el link.')
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
          sessionStorage.setItem('wikinguin-voted-links', JSON.stringify(nextIds))
        } catch {
          // Si el navegador bloquea sessionStorage, el estado de React sigue funcionando.
        }
        return nextIds
      })
    } catch {
      // Guarda el error si el backend no acepta el voto.
      toast.error('No se pudo registrar el voto.')
    } finally {
      // Libera el bloqueo del botón de voto.
      setVotingId('')
    }
  }

  function handleTogglePin(id) {
  setPinnedIds((current) => {
    const isPinned = current.includes(id)
    const next = isPinned
      ? current.filter((pinnedId) => pinnedId !== id)
      : [...current, id]
    try {
      localStorage.setItem('wikinguin-pinned-links', JSON.stringify(next))
    } catch {}
    return next
  })
  const isNowPinned = !pinnedIds.includes(id)
  if (isNowPinned) toast.success('Link fijado 📌')
  else toast.info('Link desfijado')
}

  // Cierra el detalle y regresa al listado.
  function handleBack() {
    // Elimina el link seleccionado.
    setSelectedLink(null)
    // Limpia el error del detalle anterior.
    setDetailError('')
  }

  // Devuelve el JSX que React dibuja en pantalla.
  return (
    // Fragmento con encabezado y contenido principal.
    <>
      {/* Encabezado portado del frontend vanilla. */}
      <header className="site-header">
        <nav aria-label="Navegación principal" className="site-header__nav">
          <a
            href="#"
            className="brand"
            onClick={(event) => {
              event.preventDefault()
              handleBack()
              setFilter('')
            }}
          >
            <img src="/logo.webp" alt="Logo Wikinguin" width="40" height="40" />
            <span>Wikinguin</span>
          </a>
        </nav>
      </header>
      {/* Contenedor principal de la aplicación. */}
      <main className="app">
        {/* Título visible, mismo texto que en vanilla. */}
        <h1>Recursos para Pinguinos del Saber</h1>
        <p className="app__subtitle">Revisa nuestro Directorio para ampliar tus conocimientos.</p>

      {/* El estado decide si se muestra el detalle o el listado. */}
      {selectedLink ? (
        /* Props: link, onBack, onVote, isVoting y hasVoted. */
        <LinkDetail
          link={selectedLink}
          onBack={handleBack}
          onVote={handleVote}
          isVoting={votingId === selectedLink._id}
          hasVoted={votedIds.includes(selectedLink._id)}
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

              {/* Muestra el listado solo cuando no hay carga ni error. */}
              {!loading && !error && (
                /* Props: links, onSelect, onVote, votingId y onTagClick. */
                <LinkList
                  links={sortedLinks}
                  pinnedIds={pinnedIds}
                  onTogglePin={handleTogglePin}
                  onSelect={handleSelectLink}
                  onVote={handleVote}
                  votingId={votingId}
                  votedIds={votedIds}
                  onTagClick={setFilter}
                  onDelete={handleDeleteLink}
                />
              )}
            </div>
          </div>
        </>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
      </main>
    </>
  )
}

// Exporta App para que main.jsx pueda montarlo.
export default App