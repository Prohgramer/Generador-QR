export default function Campo({ campo, valor, onChange }) {
  const id = `campo-${campo.name}`

  if (campo.type === 'checkbox') {
    return (
      <label className="campo campo--check" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={!!valor}
          onChange={(e) => onChange(campo.name, e.target.checked)}
        />
        <span>{campo.label}</span>
      </label>
    )
  }

  return (
    <div className="campo">
      <label htmlFor={id}>{campo.label}</label>
      {campo.type === 'textarea' ? (
        <textarea
          id={id}
          rows={3}
          placeholder={campo.placeholder}
          value={valor ?? ''}
          onChange={(e) => onChange(campo.name, e.target.value)}
        />
      ) : campo.type === 'select' ? (
        <select id={id} value={valor ?? ''} onChange={(e) => onChange(campo.name, e.target.value)}>
          {campo.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type="text"
          placeholder={campo.placeholder}
          value={valor ?? ''}
          onChange={(e) => onChange(campo.name, e.target.value)}
        />
      )}
    </div>
  )
}
