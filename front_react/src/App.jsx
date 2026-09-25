import { useEffect, useState } from 'react'
import { getLinkById, getLinks } from './api'
import LinkDetail from './components/LinkDetail'
import LinkList from './components/LinkList'
import TagFilter from './components/TagFilter'
import './App.css'

function App() {
  // Estado principal del listado y de la carga inicial.
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Estado que controla el texto del filtro local.
  const [filter, setFilter] = useState('')

  // Estado que controla la vista y la carga del detalle.
  const [selectedLink, setSelectedLink] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  // Normaliza el texto para buscar sin distinguir mayúsculas.
  const normalizedFilter = filter.trim().toLocaleLowerCase()

  // Filtra localmente los links que contienen la etiqueta buscada.
  const visibleLinks = normalizedFilter
    ? links.filter((link) =>
        link.tags?.some((tag) =>
          tag.toLocaleLowerCase().includes(normalizedFilter)
        )
      )
    : links

  // Solicita los links cuando la aplicación se monta por primera vez.
  useEffect(() => {
    async function loadLinks() {
      // Espera la respuesta del backend y la guarda en el estado.
      try {
        const data = await getLinks()
        setLinks(data)
      } catch {
        setError('No se pudieron cargar los links.')
      } finally {
        setLoading(false)
      }
    }

    loadLinks()
  }, [])

  // Consulta el link seleccionado y activa la vista de detalle.
  async function handleSelectLink(id) {
    setSelectedLink(null)
    setDetailError('')
    setDetailLoading(true)

    try {
      const link = await getLinkById(id)
      setSelectedLink(link)
    } catch {
      setDetailError('No se pudo cargar el link.')
    } finally {
      setDetailLoading(false)
    }
  }

  // Regresa al listado y limpia el estado del detalle.
  function handleBack() {
    setSelectedLink(null)
    setDetailError('')
  }

  // Muestra la vista correspondiente al estado actual.
  return (
    <main className="app">
      <h1>Wikinguin</h1>

      {/* El estado determina si mostramos el detalle o el listado. */}
      {selectedLink ? (
        <LinkDetail link={selectedLink} onBack={handleBack} />
      ) : detailLoading ? (
        <p>Cargando detalle...</p>
      ) : detailError ? (
        <div>
          <p role="alert">{detailError}</p>
          <button type="button" onClick={handleBack}>← Volver</button>
        </div>
      ) : (
        <>
          <TagFilter value={filter} onChange={setFilter} />
          {loading && <p>Cargando links...</p>}
          {error && <p role="alert">{error}</p>}
          {!loading && !error && (
            <LinkList links={visibleLinks} onSelect={handleSelectLink} />
          )}
        </>
      )}
    </main>
  )
}

export default App
