# 🧠 Documentación técnica — Wish Market Place

## 🗓️ Última sesión: 12 de septiembre de 2025

### ✅ Avances realizados
- Integración exitosa del endpoint `/bancos-wompi` con autenticación por clave privada
- Eliminación del filtro `status === "ACTIVE"` en producción
- Corrección de mapeo en `Pago.jsx` (`financial_institution_code` y `financial_institution_name`)
- Validación funcional del campo banco en el formulario
- Redirección exitosa al flujo de pago Wompi
- Eliminación de errores visuales y de validación en el dropdown
- Commit técnico con mensaje trazable

---

### 📌 Pendientes
- `env=undefined` en la redirección post-pago → validar `process.env.WOMPI_ENV`
- Blindaje del backend para evitar respuestas vacías sin log
- Validación visual del campo banco (estilo rojo si no se selecciona)
- Auditoría de headers sensibles en todos los endpoints Wompi
- Implementación de `auditoriaLogger.js` para trazabilidad por usuario

---

## 📁 Estructura del proyecto

mi-proyecto/
│
├── backend/ (Node.js + Express)
│   ├── server.js ───────────────▶ Montaje de rutas + body parsers
│   ├── .env ────────────────────▶ PRIVATE_KEY, WOMPI_ENV, otros tokens
│   ├── models/
│   │   ├── Product.js ──────────▶ Esquema de producto con campo 'categoria'
│   │   └── Pago.js ─────────────▶ Esquema de transacción PSE
│   ├── routes/
│   │   ├── carrito.js ─────────▶ (pendiente uso)
│   │   ├── pago.js ────────────▶ POST /pse + GET /bancos-wompi con axios y auth
│   │   ├── webhook.js ────────▶ Recepción de eventos Wompi
│   │   └── productos.js ──────▶ GET /productos + /seed con filtro por categoría
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
│   │       └── toast.js ─────▶ Alertas visuales (pendiente implementación)
│   ├── .env ───────────────────▶ REACT_APP_API_URL
│   └── package.json ──────────▶ Dependencias frontend

 flujo de pago PSE
    ├── Frontend: Pago.jsx ─────▶ Captura datos + validación + POST /pse
    ├── Backend: pago.js ───────▶ Recibe datos + genera async_payment_url
    ├── Redirección Wompi ──────▶ Usuario va a Wompi
    └── EstadoPago.jsx ────────▶ Muestra resultado con referencia y estado




---

## 🔧 Tecnologías clave

| Capa       | Tecnología               | Uso principal                                 |
|------------|--------------------------|-----------------------------------------------|
| Frontend   | React + JSX              | SPA, componentes dinámicos                    |
| Backend    | Node.js + Express        | API REST, manejo de rutas y lógica de pago    |
| API Pago   | Wompi (PSE)              | Integración de pagos, validación y redirección|
| Hosting    | Render                   | Deploy backend y frontend                     |
| Estado     | Context API              | Manejo global del carrito                     |
| Estilos    | CSS modular              | Estilos por componente                        |

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
