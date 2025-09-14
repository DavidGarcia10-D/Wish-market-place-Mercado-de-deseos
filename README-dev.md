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

wish-marketplace/
├── frontend/
│   ├── public/
│   │   └── imagenes/
│   │       └── default.jpg
│   ├── src/
│   │   ├── components/
│   │   │   ├── App.jsx
│   │   │   ├── Categoria.jsx
│   │   │   ├── Productos.jsx
│   │   │   ├── Carrito.jsx
│   │   │   ├── Pago.jsx
│   │   │   └── DatosEnvio.jsx
│   │   ├── context/
│   │   │   └── CarritoContext.js
│   │   ├── estilos/
│   │   │   └── pagoEstilos.js   ← ✅ estilos extraídos de Pago.jsx
│   │   ├── utils/
│   │   │   └── toast.js         ← ✅ funciones showSuccess / showError
│   │   ├── index.js
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── models/
│   │   └── carrito.js
│   ├── routes/
│   │   ├── carrito.js
│   │   ├── pago.js
│   │   └── webhook.js
│   ├── controllers/
│   │   └── (opcional si decides separar lógica)
│   ├── server.js
│   └── package.json
│
├── README.md
├── README-dev.md               ← ✅ (opcional para anclajes técnicos)
└── wish.code-workspace         ← ✅ (opcional para VS Code)


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
