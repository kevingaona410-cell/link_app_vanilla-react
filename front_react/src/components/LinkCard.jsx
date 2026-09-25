function LinkCard({ link, onSelect, onVote, isVoting, onTagClick }) {
  // Ejecuta el callback con el ID del link que se desea consultar.
  function handleSelect() {
    onSelect(link._id)
  }

  return (
    <article className="link-card">
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
        <button type="button" onClick={() => onVote(link._id)} disabled={isVoting}>
          {isVoting ? 'Votando...' : 'Votar'}
        </button>
        <button type="button" onClick={handleSelect}>
          Ver detalle
        </button>
      </div>
    </article>
  )
}

export default LinkCard
