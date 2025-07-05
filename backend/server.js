// 📌 Importamos librerías base
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");
require("dotenv").config();

// 📦 Importamos rutas personalizadas
const carritoRoutes = require("./routes/carrito");   // 🛒 Carrito
const pagoRoutes = require("./routes/pago");         // 💰 Pagos (incluye /:reference)
const webhookRoutes = require("./routes/webhook");   // 📬 Webhook de Wompi

// 🚀 Inicializamos la app
const app = express();

// 🌐 CORS solo permite frontend local (React) — ajusta a tu dominio en producción
app.use(cors({ origin: "http://localhost:5000" }));

// ⚠️ MUY IMPORTANTE: este raw parser solo aplica a /webhook (para validar firma HMAC)
app.use("/webhook", express.raw({ type: "application/json" }));

// 📦 Middleware global para JSON
app.use(express.json());

// 🌱 Conexión a MongoDB
const mongoURI = "mongodb://127.0.0.1:27017/miBaseDeDatos";
mongoose.connect(mongoURI)
  .then(() => console.log("🔗 Conectado a MongoDB"))
  .catch(err => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });

// 🔐 Verificamos variables .env
console.log("🔑 Llave privada de Wompi:", process.env.PRIVATE_KEY);
console.log("🔑 Llave pública de Wompi:", process.env.PUBLIC_KEY);
console.log("🔐 Llave de integridad:", process.env.INTEGRITY_SECRET);

// 🧪 Ruta base de prueba
app.get("/", (req, res) => {
  res.send("🚀 ¡Servidor funcionando correctamente!");
});

// 📦 Rutas de productos
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

// 🛠️ Rutas personalizadas montadas en prefijos correctos
app.use("/carrito", carritoRoutes); // ➝ /carrito/*
app.use("/pago", pagoRoutes);       // ➝ /pago/pse, /pago/:reference ✅
app.use("/webhook", webhookRoutes); // ➝ /webhook (raw)

// 🏦 Bancos de prueba (útil si usas solo esto en sandbox)
app.get("/bancos", (req, res) => {
  res.json([
    { nombre: "Bancolombia", codigo: "007" },
    { nombre: "Banco de Bogotá", codigo: "001" },
    { nombre: "Davivienda", codigo: "051" },
    { nombre: "Banco Popular", codigo: "002" },
    { nombre: "Banco Caja Social", codigo: "032" },
    { nombre: "BBVA", codigo: "013" },
    { nombre: "Banco de Occidente", codigo: "023" },
    { nombre: "Citibank", codigo: "009" },
    { nombre: "Scotiabank Colpatria", codigo: "019" },
    { nombre: "Nequi", codigo: "507" },
    { nombre: "Daviplata", codigo: "551" }
  ]);
});

// 🚀 Arrancamos el servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
