import LinkCard from './LinkCard'

function LinkList({ links, onSelect, onVote, votingId, onTagClick }) {
  // Muestra un estado específico cuando no hay recursos.
  if (links.length === 0) {
    return <p>Todavía no hay links.</p>
  }

  return (
    <div className="links-list" aria-live="polite">
      {/* Convierte cada objeto de la API en una tarjeta reutilizable. */}
      {links.map((link) => (
        <LinkCard
          key={link._id}
          link={link}
          onSelect={onSelect}
          onVote={onVote}
          isVoting={votingId === link._id}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  )
}

export default LinkList
