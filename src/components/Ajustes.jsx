const NIVELES = [
  { value: 'L', label: 'L · mínimo, código más pequeño' },
  { value: 'M', label: 'M · equilibrado' },
  { value: 'Q', label: 'Q · resiste marcas y dobleces' },
  { value: 'H', label: 'H · máximo, necesario con logo' },
]

// Luminancia relativa (WCAG) para avisar cuando tinta y fondo se parecen demasiado.
const luminancia = (hex) => {
  const canal = (i) => {
    const v = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * canal(0) + 0.7152 * canal(1) + 0.0722 * canal(2)
}

const contraste = (a, b) => {
  const [claro, oscuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (oscuro + 0.05)
}

export default function Ajustes({ opciones, onChange, onLogo }) {
  const set = (clave) => (e) => onChange(clave, e.target.value)
  const pocoContraste = contraste(opciones.colorOscuro, opciones.colorClaro) < 4

  return (
    <div className="ajustes">
      <div className="campo">
        <label htmlFor="tamano">
          Tamaño <span className="valor">{opciones.size} px</span>
        </label>
        <input
          id="tamano"
          type="range"
          min="128"
          max="1024"
          step="32"
          value={opciones.size}
          onChange={(e) => onChange('size', Number(e.target.value))}
        />
      </div>

      <div className="campo">
        <label htmlFor="margen">
          Margen <span className="valor">{opciones.margin} módulos</span>
        </label>
        <input
          id="margen"
          type="range"
          min="0"
          max="8"
          value={opciones.margin}
          onChange={(e) => onChange('margin', Number(e.target.value))}
        />
      </div>

      <div className="campo">
        <label htmlFor="nivel">Corrección de errores</label>
        <select id="nivel" value={opciones.nivel} onChange={set('nivel')}>
          {NIVELES.map((n) => (
            <option key={n.value} value={n.value}>
              {n.label}
            </option>
          ))}
        </select>
      </div>

      <div className="colores">
        <div className="campo">
          <label htmlFor="color-oscuro">Tinta</label>
          <input
            id="color-oscuro"
            type="color"
            value={opciones.colorOscuro}
            onChange={set('colorOscuro')}
          />
        </div>
        <div className="campo">
          <label htmlFor="color-claro">Fondo</label>
          <input
            id="color-claro"
            type="color"
            value={opciones.colorClaro}
            onChange={set('colorClaro')}
          />
        </div>
      </div>

      {pocoContraste && (
        <p className="aviso" role="status">
          Con tan poco contraste entre tinta y fondo, muchas lectoras no van a reconocer el código.
        </p>
      )}

      <div className="campo">
        <label htmlFor="logo">Logo en el centro</label>
        <input id="logo" type="file" accept="image/*" onChange={onLogo} />
        <p className="apunte">
          Opcional. Al añadirlo se sube la corrección de errores a H para que el código siga
          leyéndose.
        </p>
        {opciones.logo && (
          <button type="button" className="enlace" onClick={() => onChange('logo', null)}>
            Quitar el logo
          </button>
        )}
      </div>
    </div>
  )
}
