import LinkCard from './LinkCard'

function LinkList({ links, onSelect, onVote, votingId, votedIds, onTagClick, onDelete,pinnedIds, onTogglePin }) {
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
          hasVoted={votedIds.includes(link._id)}
          onTagClick={onTagClick}
          onDelete={onDelete}
          isPinned={pinnedIds.includes(link._id)}
          onTogglePin={onTogglePin}
        />
      ))}
    </div>
  )
}

export default LinkList
