# Generador de QR

Aplicación en React (Vite) para crear códigos QR. Todo el procesamiento ocurre en el
navegador: no se envía ningún dato a un servidor.

## Uso

```bash
npm install
npm run dev
```

Abre http://localhost:5173

Para generar la versión de producción en `dist/`:

```bash
npm run build
npm run preview
```

## Qué incluye

- **Tipos de contenido**: texto/URL, red WiFi, email, SMS.
- **Personalización**: tamaño, margen, nivel de corrección de errores, tinta y fondo.
- **Logo central** opcional (sube el nivel de corrección a H automáticamente).
- **Ficha técnica** en vivo: módulos, versión del código, nivel de corrección y caracteres.
- **Aviso de contraste** cuando la tinta y el fondo se parecen tanto que el código dejaría de leerse.
- **Exportar**: descarga en PNG o SVG y copia la imagen al portapapeles.

## Dirección visual

La página es una hoja de pruebas de imprenta: plancha azul tinta con retícula de
módulos, la aplicación como hoja de papel encima y el rosa flúor reservado a lo
maquinal (los patrones de posición del logotipo, las marcas de corte de la vista
previa y los controles activos). Tipografías Archivo (expandida, en el membrete) y
DM Mono (rótulos y datos), servidas desde el propio proyecto vía `@fontsource`: no
se pide nada a servidores externos, en coherencia con lo que promete la interfaz.

## Estructura

```
src/
  App.jsx                    estado principal y composición de la interfaz
  index.css                  estilos (con modo oscuro automático)
  lib/payloads.js            tipos de contenido y construcción del texto del QR
  lib/qr.js                  render a canvas/SVG y descargas
  components/Campo.jsx       campo de formulario genérico
  components/Ajustes.jsx     controles de personalización
  components/Previsualizacion.jsx  vista previa y acciones de exportación
```

Para añadir un tipo de contenido nuevo basta con añadir una entrada a `TYPES` en
`src/lib/payloads.js` con sus campos y su función `build()`.
