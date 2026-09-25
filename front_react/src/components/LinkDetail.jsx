function LinkDetail({ link, onBack }) {
  // Muestra los datos completos del link seleccionado.
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
    </section>
    )
}

export default LinkDetail

