function LinkCard({ link, onSelect }) {
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
      {link.tags?.length > 0 && (
        <ul>
          {link.tags.map((tag) => (
            <li key={`${link._id}-${tag}`}>{tag}</li>
          ))}
        </ul>
      )}
      <button type="button" onClick={handleSelect}>
        Ver detalle
      </button>
    </article>
  )
}

export default LinkCard
