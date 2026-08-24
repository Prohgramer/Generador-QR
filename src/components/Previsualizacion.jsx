import { useEffect, useMemo, useRef, useState } from 'react'
import { drawToCanvas, toPngDataUrl, toSvgString, descargar, analizar } from '../lib/qr'

export default function Previsualizacion({ texto, opciones, nombreArchivo }) {
  const canvasRef = useRef(null)
  const [error, setError] = useState(null)
  const [copiado, setCopiado] = useState(null)
  const hayContenido = texto.length > 0

  const ficha = useMemo(
    () => (hayContenido ? analizar(texto, opciones) : null),
    [texto, opciones, hayContenido]
  )

  useEffect(() => {
    if (!hayContenido) return
    const lienzo = canvasRef.current
    let cancelado = false

    drawToCanvas(lienzo, texto, opciones)
      .then(() => {
        if (cancelado) return
        setError(null)
        lienzo.classList.remove('imprimiendo')
        void lienzo.offsetWidth
        lienzo.classList.add('imprimiendo')
      })
      .catch((e) => !cancelado && setError(mensajeDeError(e)))

    return () => {
      cancelado = true
    }
  }, [texto, opciones, hayContenido])

  const listo = hayContenido && !error

  const descargarPng = () => descargar(toPngDataUrl(canvasRef.current), `${nombreArchivo}.png`)

  const descargarSvg = async () => {
    const svg = await toSvgString(texto, opciones)
    descargar(svg, `${nombreArchivo}.svg`, 'image/svg+xml')
  }

  const copiar = async () => {
    try {
      const blob = await new Promise((r) => canvasRef.current.toBlob(r, 'image/png'))
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setCopiado('Copiado')
    } catch {
      setCopiado('No se pudo copiar')
    }
    setTimeout(() => setCopiado(null), 1800)
  }

  return (
    <section className="prueba">
      <h2 className="rotulo">Vista previa</h2>

      <div className="marco">
        <span className="marca marca--si" aria-hidden="true" />
        <span className="marca marca--sd" aria-hidden="true" />
        <span className="marca marca--ii" aria-hidden="true" />
        <span className="marca marca--id" aria-hidden="true" />

        <div className="lienzo">
          <canvas ref={canvasRef} style={{ display: listo ? 'block' : 'none' }} />
          {!hayContenido && <p className="pista">Escribe el contenido y el código aparece aquí.</p>}
          {error && <p className="pista pista--error">{error}</p>}
        </div>
      </div>

      <dl className="ficha">
        <Dato etiqueta="Módulos" valor={ficha ? `${ficha.modulos} × ${ficha.modulos}` : null} />
        <Dato etiqueta="Versión" valor={ficha ? ficha.version : null} />
        <Dato etiqueta="Corrección" valor={opciones.nivel} />
        <Dato etiqueta="Caracteres" valor={hayContenido ? texto.length : null} />
      </dl>

      <div className="acciones">
        <button type="button" onClick={descargarPng} disabled={!listo}>
          Descargar PNG
        </button>
        <button type="button" className="secundario" onClick={descargarSvg} disabled={!listo}>
          Descargar SVG
        </button>
        <button type="button" className="secundario" onClick={copiar} disabled={!listo}>
          {copiado || 'Copiar imagen'}
        </button>
      </div>

      {listo && (
        <details className="contenido">
          <summary>Ver el texto que se codifica</summary>
          <pre>{texto}</pre>
        </details>
      )}
    </section>
  )
}

function Dato({ etiqueta, valor }) {
  return (
    <div className="dato">
      <dt>{etiqueta}</dt>
      <dd>{valor ?? '—'}</dd>
    </div>
  )
}

function mensajeDeError(e) {
  const msg = String(e?.message || e)
  if (/too (long|big)|code length overflow/i.test(msg)) {
    return 'El contenido no cabe en un código QR. Acórtalo o baja el nivel de corrección de errores.'
  }
  return 'No se ha podido generar el código: ' + msg
}
