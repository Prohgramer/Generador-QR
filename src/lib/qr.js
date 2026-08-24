import QRCode from 'qrcode'

const LOGO_RATIO = 0.22

const baseOptions = ({ size, margin, colorOscuro, colorClaro, nivel }) => ({
  width: size,
  margin,
  errorCorrectionLevel: nivel,
  color: { dark: colorOscuro, light: colorClaro },
})

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

export async function drawToCanvas(canvas, texto, opciones) {
  await QRCode.toCanvas(canvas, texto, baseOptions(opciones))
  if (!opciones.logo) return

  const img = await loadImage(opciones.logo)
  const ctx = canvas.getContext('2d')
  const lado = canvas.width * LOGO_RATIO
  const x = (canvas.width - lado) / 2
  const relleno = lado * 0.12

  ctx.fillStyle = opciones.colorClaro
  ctx.fillRect(x - relleno, x - relleno, lado + relleno * 2, lado + relleno * 2)
  ctx.drawImage(img, x, x, lado, lado)
}

export function toPngDataUrl(canvas) {
  return canvas.toDataURL('image/png')
}

export async function toSvgString(texto, opciones) {
  const svg = await QRCode.toString(texto, { ...baseOptions(opciones), type: 'svg' })
  if (!opciones.logo) return svg

  const viewBox = svg.match(/viewBox="0 0 (\d+(?:\.\d+)?) /)
  if (!viewBox) return svg

  const total = Number(viewBox[1])
  const lado = total * LOGO_RATIO
  const x = (total - lado) / 2
  const relleno = lado * 0.12
  const capa =
    `<rect x="${x - relleno}" y="${x - relleno}" width="${lado + relleno * 2}" ` +
    `height="${lado + relleno * 2}" fill="${opciones.colorClaro}"/>` +
    `<image href="${opciones.logo}" x="${x}" y="${x}" width="${lado}" height="${lado}"/>`

  return svg.replace('</svg>', capa + '</svg>')
}

export function descargar(contenido, nombreArchivo, tipoMime) {
  const url = tipoMime
    ? URL.createObjectURL(new Blob([contenido], { type: tipoMime }))
    : contenido
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo
  document.body.appendChild(a)
  a.click()
  a.remove()
  if (tipoMime) URL.revokeObjectURL(url)
}

export function analizar(texto, opciones) {
  try {
    const qr = QRCode.create(texto, { errorCorrectionLevel: opciones.nivel })
    return { version: qr.version, modulos: qr.modules.size }
  } catch {
    return null
  }
}
