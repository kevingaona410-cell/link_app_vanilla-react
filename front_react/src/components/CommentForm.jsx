import { useState } from 'react'

function CommentForm({ onSubmit, submitting }) {
  // Controla los campos y valida antes de enviar un comentario.
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    const cleanAuthor = author.trim()
    const cleanContent = content.trim()

    if (!cleanAuthor || !cleanContent) {
      setError('Completa nombre y comentario.')
      return
    }

    setError('')

    try {
      await onSubmit({ author: cleanAuthor, content: cleanContent })
      setAuthor('')
      setContent('')
    } catch {
      setError('No se pudo crear el comentario.')
    }
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      <label htmlFor="comment-author">Nombre</label>
      <input
        id="comment-author"
        type="text"
        value={author}
        onChange={(event) => setAuthor(event.target.value)}
        required
      />

      <label htmlFor="comment-content">Comentario</label>
      <textarea
        id="comment-content"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        required
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Enviando...' : 'Enviar comentario'}
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  )
}

export default CommentForm
