function LinkDetail({ link, onBack, onVote, isVoting, voteError }) {
  // Muestra los datos completos y la acción de voto.
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
    </section>
  )
}

export default LinkDetail


