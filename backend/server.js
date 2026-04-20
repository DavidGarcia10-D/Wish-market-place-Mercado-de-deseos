const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");
require("dotenv").config();

const carritoRoutes = require("./routes/carrito");
const pagoRoutes = require("./routes/pago");
const productosRoutes = require("./routes/productos");
const rutaEnvios = require("./routes/envios");

const app = express();

// 🌍 Orígenes permitidos para CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "https://wish-market-place-front.onrender.com"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ⚠️ Raw parser SOLO para /webhook (necesario para verificar firma de Wompi)
// 🔄 Este middleware debe ir ANTES de express.json()
app.post("/webhook", express.raw({ type: "application/json" }), require("./routes/webhook"));

// 🌐 JSON parser para el resto de rutas
app.use(express.json());

// 🔁 Módulo de envíos
app.use("/envios", rutaEnvios);

// 🔐 Validación de llaves y URI
if (
  !process.env.MONGO_URI ||
  !process.env.PRIVATE_KEY ||
  !process.env.PUBLIC_KEY ||
  !process.env.INTEGRITY_SECRET
) {
  console.error("❌ Faltan variables de entorno (.env)");
  process.exit(1);
}

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log("🔗 Conectado a MongoDB"))
  .catch(err => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });

// 🔍 Mostrar llaves y entorno actual
console.log("🔑 Llave privada Wompi:", process.env.PRIVATE_KEY);
console.log("🔑 Llave pública Wompi:", process.env.PUBLIC_KEY);
console.log("🔐 Llave integridad:", process.env.INTEGRITY_SECRET);
console.log("🌐 Entorno Wompi:", process.env.WOMPI_ENV || "sandbox");

// 🏁 Ruta base
app.get("/", (req, res) => {
  res.send("🚀 ¡Servidor funcionando correctamente!");
});

// 📦 Productos
app.get("/productos", async (req, res) => {
  try {
    const productos = await Product.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

app.post("/productos", async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error("❌ Error al guardar producto:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ NUEVA RUTA para productos por categoría y seed
app.use("/api/productos", productosRoutes);

// 🛒 Rutas principales
app.use("/carrito", carritoRoutes);
app.use("/pago", pagoRoutes);

// 🚀 Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});