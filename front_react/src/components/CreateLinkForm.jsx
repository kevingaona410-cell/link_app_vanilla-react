import { useState } from 'react'
import { toast } from 'react-toastify'

function CreateLinkForm({ onCreate }) {
  // Controla los campos del formulario y su mensaje de estado.
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: ''
  })
  
  const [submitting, setSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
  }

  // Valida y transforma los valores antes de llamar a la API.
  async function handleSubmit(event) {
    event.preventDefault()

    const title = formData.title.trim()
    const url = formData.url.trim()
    const description = formData.description.trim()
    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (!title || !url) {
      toast.error('Título y URL son obligatorios.')
      return
    }

    setSubmitting(true)

    try {
      await onCreate({ title, url, description, tags })
      setFormData({ title: '', url: '', description: '', tags: '' })
      toast.success('Link creado correctamente.')
    } catch {
      toast.error('No se pudo crear el link.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="create-link-form" onSubmit={handleSubmit}>
      <h2>Guardar un nuevo recurso</h2>

      <label htmlFor="new-link-title">Título</label>
      <input
        id="new-link-title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label htmlFor="new-link-url">URL</label>
      <input
        id="new-link-url"
        name="url"
        type="url"
        value={formData.url}
        onChange={handleChange}
        required
      />

      <label htmlFor="new-link-description">Descripción</label>
      <textarea
        id="new-link-description"
        name="description"
        value={formData.description}
        onChange={handleChange}
      />

      <label htmlFor="new-link-tags">Etiquetas</label>
      <input
        id="new-link-tags"
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        placeholder="javascript, css, recursos"
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Guardando...' : 'Guardar link'}
      </button>
    </form>
  )
}

export default CreateLinkForm
