function LinkCard({ link, onSelect, onVote, isVoting, hasVoted, onTagClick, onDelete, isPinned, onTogglePin }) {
  // Ejecuta el callback con el ID del link que se desea consultar.
  function handleSelect() {
    onSelect(link._id)
  }

  async function handleDelete() {
    await onDelete(link._id)
  }

  return (
    <article className={isPinned ? 'link-card link-card--pinned' : 'link-card'}>
      {isPinned && <span className="pin-badge">📌 FIJADO</span>}
      <h2>{link.title}</h2>
      <a href={link.url} target="_blank" rel="noopener noreferrer">
        {link.url}
      </a>
      <p className="link-card__votes">Votos: {link.votes ?? 0}</p>
      {link.tags?.length > 0 && (
        <ul>
          {link.tags.map((tag) => (
            <li key={`${link._id}-${tag}`}>
              <button type="button" onClick={() => onTagClick(tag)}>
                {tag}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="link-card__actions">
        {/* Deshabilita el botón si ya votó en esta sesión. */}
        <button
          type="button"
          onClick={() => onVote(link._id)}
          disabled={isVoting || hasVoted}
        >
          {hasVoted ? 'Ya votaste' : isVoting ? 'Votando...' : 'Votar'}
        </button>
        <button type="button" onClick={handleSelect}>
          Ver detalle
        </button>

        <button type="button" onClick={handleDelete}>
          Eliminar
        </button>

        <button type="button" onClick={() => onTogglePin(link._id)}>
          {isPinned ? 'Desfijar 📌' : 'Fijar 📌'}
        </button>

      </div>
    </article>
  )
}

export default LinkCard
