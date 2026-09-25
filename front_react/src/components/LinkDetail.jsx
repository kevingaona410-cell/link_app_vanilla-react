import { useEffect, useState } from 'react'
import { createComment, getComments } from '../api'
import CommentForm from './CommentForm'
import CommentList from './CommentList'

function LinkDetail({ link, onBack, onVote, isVoting, voteError }) {
  // Mantiene los comentarios y el estado de su formulario.
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(true)
  const [commentsError, setCommentsError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Carga los comentarios cada vez que se abre un link diferente.
  useEffect(() => {
    let cancelled = false

    async function loadComments() {
      try {
        const data = await getComments(link._id)
        if (!cancelled) setComments(data)
      } catch {
        if (!cancelled) setCommentsError('No se pudieron cargar los comentarios.')
      } finally {
        if (!cancelled) setCommentsLoading(false)
      }
    }

    loadComments()

    return () => {
      cancelled = true
    }
  }, [link._id])

  // Agrega un comentario nuevo al principio sin recargar el detalle.
  async function handleCreateComment(data) {
    setSubmitting(true)

    try {
      const newComment = await createComment(link._id, data)
      setComments((currentComments) => [newComment, ...currentComments])
    } finally {
      setSubmitting(false)
    }
  }

  // Muestra los datos completos, el voto y los comentarios.
  return (
    <section className="link-detail">
      <button type="button" onClick={onBack}>
        ← Volver
      </button>
      <h2>{link.title}</h2>
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {link.url}
      </a>
      <p>{link.description || 'Este link no tiene descripción.'}</p>

      <div className="link-detail__vote">
        <p>Votos: {link.votes ?? 0}</p>
        <button type="button" onClick={() => onVote(link._id)} disabled={isVoting}>
          {isVoting ? 'Votando...' : 'Votar'}
        </button>
        {voteError && <p role="alert">{voteError}</p>}
      </div>

      <section className="comments">
        <h3>Comentarios</h3>
        <CommentList
          comments={comments}
          loading={commentsLoading}
          error={commentsError}
        />
        {/* Evita enviar mientras todavía se carga la lista inicial. */}
        {!commentsLoading && (
          <CommentForm onSubmit={handleCreateComment} submitting={submitting} />
        )}
      </section>
    </section>
  )
}

export default LinkDetail


