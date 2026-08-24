import { useMemo, useState } from 'react'
import { TYPES, getType, initialValues } from './lib/payloads'
import Campo from './components/Campo'
import Ajustes from './components/Ajustes'
import Previsualizacion from './components/Previsualizacion'

const VALORES_INICIALES = TYPES.reduce((acc, t) => {
  acc[t.id] = initialValues(t)
  return acc
}, {})

const OPCIONES_INICIALES = {
  size: 320,
  margin: 2,
  nivel: 'M',
  colorOscuro: '#101423',
  colorClaro: '#ffffff',
  logo: null,
}

function Patrones() {
  return (
    <svg className="patrones" viewBox="0 0 30 30" aria-hidden="true">
      {[
        [0, 0],
        [17, 0],
        [0, 17],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="13" height="13" fill="none" strokeWidth="3" />
          <rect x={x + 5} y={y + 5} width="3" height="3" />
        </g>
      ))}
    </svg>
  )
}

export default function App() {
  const [tipoId, setTipoId] = useState('texto')
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [opciones, setOpciones] = useState(OPCIONES_INICIALES)

  const tipo = getType(tipoId)
  const texto = useMemo(() => tipo.build(valores[tipoId]), [tipo, valores, tipoId])

  const cambiarCampo = (nombre, valor) =>
    setValores((prev) => ({ ...prev, [tipoId]: { ...prev[tipoId], [nombre]: valor } }))

  const cambiarOpcion = (clave, valor) => setOpciones((prev) => ({ ...prev, [clave]: valor }))

  const cargarLogo = (e) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return
    const lector = new FileReader()
    lector.onload = () => setOpciones((prev) => ({ ...prev, logo: lector.result, nivel: 'H' }))
    lector.readAsDataURL(archivo)
  }

  const limpiar = () => {
    setValores((prev) => ({ ...prev, [tipoId]: initialValues(tipo) }))
    setOpciones(OPCIONES_INICIALES)
  }

  return (
    <div className="hoja">
      <header className="cabecera">
        <div className="membrete">
          <Patrones />
          <h1>Generador QR</h1>
        </div>
        <p className="lema">Se genera aquí mismo. Nada sale de tu navegador.</p>
      </header>

      <main className="panel">
        <section className="editor">
          <h2 className="rotulo">Contenido</h2>

          <nav className="tabs" role="tablist" aria-label="Tipo de contenido">
            {TYPES.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={t.id === tipoId}
                className={t.id === tipoId ? 'tab activa' : 'tab'}
                onClick={() => setTipoId(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <form className="formulario" onSubmit={(e) => e.preventDefault()}>
            {tipo.fields.map((campo) => (
              <Campo
                key={campo.name}
                campo={campo}
                valor={valores[tipoId][campo.name]}
                onChange={cambiarCampo}
              />
            ))}
          </form>

          <details className="personalizar" open>
            <summary>Aspecto</summary>
            <Ajustes opciones={opciones} onChange={cambiarOpcion} onLogo={cargarLogo} />
          </details>

          <button type="button" className="enlace" onClick={limpiar}>
            Vaciar campos y volver al aspecto inicial
          </button>
        </section>

        <Previsualizacion texto={texto} opciones={opciones} nombreArchivo={`qr-${tipoId}`} />
      </main>

      <footer className="pie">
        <span>Generador QR</span>
        <span>React · qrcode.js · sin servidor</span>
      </footer>
    </div>
  )
}
