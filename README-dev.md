# 🧠 Documentación técnica — Wish Market Place

## 🗓️ Última sesión: 13 de septiembre de 2025

---

### ✅ Avances realizados

- 🧩 Separación y modularización de frontend y backend para despliegue limpio en Render
- 🛠️ Instalación y configuración correcta de `react-toastify` en `frontend/` con estilos y `ToastContainer` funcional
- 🧼 Eliminación de instalación duplicada de dependencias en la raíz
- 🧠 Corrección de error `useState` por montaje incorrecto del `ToastContainer`
- 🚀 Deploy exitoso en Render: frontend SPA y backend Express operativos
- 🔗 Webhook funcional en producción (`/webhook`) con `express.raw()` y validación de firma
- 🧭 Redirección post-pago validada y funcional (`EstadoPago.jsx`)
- 🧱 Reestructuración de `routes/envios.js` con importación correcta del modelo `Envio.js`
- 🧪 Validación de build y estructura de carpetas para evitar errores en producción

---

### 📌 Pendientes

- `env=undefined` en la redirección post-pago → validar `process.env.WOMPI_ENV`
- Blindaje del backend para evitar respuestas vacías sin log
- Validación visual del campo banco (estilo rojo si no se selecciona)
- Auditoría de headers sensibles en todos los endpoints Wompi
- Implementación de `auditoriaLogger.js` para trazabilidad por usuario
- Encapsular toasts en componente reutilizable (`toast.js`)
- Activar ruta `/envios` desde frontend para registrar datos logísticos

---

## 📁 Estructura del proyecto

mi-proyecto/
│
├── backend/ (Node.js + Express)
│   ├── server.js ───────────────▶ Montaje de rutas + body parsers
│   ├── .env ────────────────────▶ PRIVATE_KEY, WOMPI_ENV, otros tokens
│   ├── models/
│   │   ├── Product.js ──────────▶ Esquema de producto con campo 'categoria'
│   │   ├── Pago.js ─────────────▶ Esquema de transacción PSE
│   │   └── Envio.js ────────────▶ Esquema logístico (nuevo)
│   ├── routes/
│   │   ├── carrito.js ─────────▶ (pendiente uso)
│   │   ├── pago.js ────────────▶ POST /pse + GET /bancos-wompi con axios y auth
│   │   ├── webhook.js ────────▶ Recepción de eventos Wompi
│   │   ├── productos.js ──────▶ GET /productos + /seed con filtro por categoría
│   │   └── envios.js ─────────▶ POST /envios (nuevo, conectado a modelo)
│   ├── scripts/
│   │   └── Firmador.js ───────▶ Firma de payloads (uso futuro)
│   ├── utils/
│   │   └── auditoriaLogger.js ─▶ Logger de acciones por usuario (pendiente)
│   └── package.json ──────────▶ Dependencias backend
│
├── frontend/ (React SPA)
│   ├── public/
│   │   └── imagenes/ ──────────▶ Imágenes de productos
│   ├── src/
│   │   ├── App.jsx ───────────▶ Enrutador principal + estado de categoría
│   │   ├── index.js ─────────▶ Montaje de ReactDOM
│   │   ├── components/
│   │   │   ├── Pago.jsx ─────▶ Formulario PSE con validación y mapeo de bancos
│   │   │   ├── EstadoPago.jsx ─▶ Página post-pago con estado y referencia
│   │   │   ├── Productos.jsx ─▶ Renderiza productos filtrados + botón carrito
│   │   │   ├── Productos.css ─▶ Estilos para cards y botón “Agregar al carrito”
│   │   │   ├── Categoria.jsx ─▶ Botones para seleccionar categoría
│   │   │   └── Categoria.css ─▶ Estilos para botones y categoría activa
│   │   ├── context/
│   │   │   └── CarritoContext.js ─▶ Estado global del carrito
│   │   └── utils/
│   │       └── toast.js ─────▶ Alertas visuales (pendiente encapsulación)
│   ├── .env ───────────────────▶ REACT_APP_API_URL
│   └── package.json ──────────▶ Dependencias frontend

---

## 🔄 Flujo de pago PSE



---

                ┌────────────────────────────┐
                │        FRONTEND (React)    │
                │        SPA + Context API   │
                └────────────┬───────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ App.jsx ─────────────▶ Enrutador principal + estado de categoría            │
│                                                                             │
│ ┌───────────────┬────────────────────────────┬───────────────────────────┐ │
│ │ Categoria.jsx │ Productos.jsx              │ Pago.jsx                  │ │
│ │ (filtro)      │ (cards + carrito)          │ (formulario PSE)          │ │
│ └───────────────┴────────────────────────────┴───────────────────────────┘ │
│                                     │                                       │
│                                     ▼                                       │
│                             EstadoPago.jsx                                 │
│                                                                             │
│ context/CarritoContext.js ─────▶ Estado global del carrito                 │
└─────────────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │        BACKEND (Express)   │
                │        API REST + Wompi    │
                └────────────┬───────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ server.js ──────▶ .env (PRIVATE_KEY, WOMPI_ENV)                            │
│                                                                             │
│ ┌───────────────┬────────────────────────────┬───────────────────────────┐ │
│ │ productos.js  │ pago.js                    │ webhook.js                │ │
│ │ (filtro)      │ (POST /pse + GET /bancos) │ (eventos Wompi)           │ │
│ └───────────────┴────────────────────────────┴───────────────────────────┘ │
│                                                                             │
│ models/ ───▶ Product.js, Pago.js                                            │
│ utils/ ────▶ auditoriaLogger.js (pendiente)                                │
└─────────────────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                ┌────────────────────────────┐
                │        WOMPI API (PSE)     │
                │        async_payment_url   │
                └────────────────────────────┘
