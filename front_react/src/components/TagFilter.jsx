function TagFilter({ value, onChange }) {
  // Controla el campo mediante el estado de App.
    return (
        <div className="tag-filter">
            <label htmlFor="tag-filter">Filtrar por etiqueta</label>
                <input
                id="tag-filter"
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Ej. javascript"
            />
        </div>
    )
}

export default TagFilter
