function CommentList({ comments, loading, error }) {
  // Muestra estados claros mientras se cargan o fallan los comentarios.
  if (loading) {
    return <p>Cargando comentarios...</p>
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  if (comments.length === 0) {
    return <p>Todavía no hay comentarios.</p>
  }

  return (
    <div className="comments-list">
      {comments.map((comment) => (
        <article className="comment" key={comment._id}>
          <p className="comment__author">{comment.author}</p>
          <p>{comment.content}</p>
          <small>
            {comment.createdAt
              ? new Date(comment.createdAt).toLocaleString('es')
              : ''}
          </small>
        </article>
      ))}
    </div>
  )
}

export default CommentList
