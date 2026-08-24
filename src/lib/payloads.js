
const escapeWifi = (value = '') => value.replace(/([\\;,:"])/g, '\\$1')

const escapeVcard = (value = '') =>
  value
    .replace(/\\/g, '\\\\')
    .replace(/[;,]/g, (c) => '\\' + c)
    .replace(/\n/g, '\\n')

export const TYPES = [
  {
    id: 'texto',
    label: 'Texto / URL',
    fields: [
      { name: 'texto', label: 'Texto o enlace', type: 'textarea', placeholder: 'https://ejemplo.com' },
    ],
    build: ({ texto }) => (texto || '').trim(),
  },
  {
    id: 'wifi',
    label: 'WiFi',
    fields: [
      { name: 'ssid', label: 'Nombre de la red (SSID)', placeholder: 'MiRedWiFi' },
      { name: 'password', label: 'Contraseña', placeholder: '••••••••' },
      {
        name: 'seguridad',
        label: 'Seguridad',
        type: 'select',
        options: [
          { value: 'WPA', label: 'WPA/WPA2/WPA3' },
          { value: 'WEP', label: 'WEP' },
          { value: 'nopass', label: 'Sin contraseña' },
        ],
        default: 'WPA',
      },
      { name: 'oculta', label: 'Red oculta', type: 'checkbox' },
    ],
    build: ({ ssid, password, seguridad = 'WPA', oculta }) => {
      if (!ssid) return ''
      const tipo = seguridad === 'nopass' ? 'nopass' : seguridad
      const pass = tipo === 'nopass' ? '' : escapeWifi(password || '')
      return `WIFI:T:${tipo};S:${escapeWifi(ssid)};P:${pass};${oculta ? 'H:true;' : ''};`
    },
  },
  {
    id: 'email',
    label: 'Email',
    fields: [
      { name: 'para', label: 'Destinatario', placeholder: 'hola@ejemplo.com' },
      { name: 'asunto', label: 'Asunto', placeholder: 'Consulta' },
      { name: 'cuerpo', label: 'Mensaje', type: 'textarea', placeholder: 'Escribe el mensaje...' },
    ],
    build: ({ para, asunto, cuerpo }) => {
      if (!para) return ''
      const query = []
      if (asunto) query.push(`subject=${encodeURIComponent(asunto)}`)
      if (cuerpo) query.push(`body=${encodeURIComponent(cuerpo)}`)
      return `mailto:${para.trim()}${query.length ? '?' + query.join('&') : ''}`
    },
  },
  {
    id: 'sms',
    label: 'SMS',
    fields: [
      { name: 'telefono', label: 'Teléfono', placeholder: '+34600000000' },
      { name: 'mensaje', label: 'Mensaje', type: 'textarea', placeholder: 'Hola!' },
    ],
    build: ({ telefono, mensaje }) => {
      if (!telefono) return ''
      const tel = telefono.replace(/\s/g, '')
      return mensaje ? `SMSTO:${tel}:${mensaje}` : `SMSTO:${tel}:`
    },
  }
]

export const getType = (id) => TYPES.find((t) => t.id === id) || TYPES[0]

export const initialValues = (type) =>
  type.fields.reduce((acc, f) => {
    acc[f.name] = f.default ?? (f.type === 'checkbox' ? false : '')
    return acc
  }, {})
