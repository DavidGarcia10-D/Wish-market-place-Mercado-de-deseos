// 📌 Importamos librerías base
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");
require("dotenv").config();

// 📦 Rutas personalizadas
const carritoRoutes = require("./routes/carrito");   // 🛒 Carrito
const pagoRoutes = require("./routes/pago");         // 💰 Pagos
const webhookRoutes = require("./routes/webhook");   // 📬 Webhook Wompi

// 🚀 Inicializamos la app
const app = express();

// 🌐 CORS — en producción, cambia por tu dominio real
app.use(cors({ origin: "http://localhost:5000" }));

// ⚠️ CORREGIDO: Parser raw necesario SOLO para /webhook → habilita validación HMAC
app.use("/webhook", express.raw({ type: "*/*" }));

// 📦 Middleware global para JSON (no afecta /webhook)
app.use(express.json());

// 🌱 Conexión a MongoDB local
const mongoURI = "mongodb://127.0.0.1:27017/miBaseDeDatos";
mongoose.connect(mongoURI)
  .then(() => console.log("🔗 Conectado a MongoDB"))
  .catch(err => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });

// 🔐 Verificación de variables .env
console.log("🔑 Llave privada Wompi:", process.env.PRIVATE_KEY);
console.log("🔑 Llave pública Wompi:", process.env.PUBLIC_KEY);
console.log("🔐 Llave integridad:", process.env.INTEGRITY_SECRET);

// 🧪 Ruta de prueba
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

// 🛠️ Rutas personalizadas
app.use("/carrito", carritoRoutes);
app.use("/pago", pagoRoutes);
app.use("/webhook", webhookRoutes); // 🧬 Webhook con raw body parser

// 🏦 Lista completa de bancos (sandbox + reales)
app.get("/bancos", (req, res) => {
  res.json([
    { nombre: "Banco que aprueba (Sandbox)", codigo: "1" },
    { nombre: "Banco que rechaza (Sandbox)", codigo: "2" },
    { nombre: "Banco de Bogotá", codigo: "1001" },
    { nombre: "Banco Popular", codigo: "1002" },
    { nombre: "Itaú (antes Corpbanca)", codigo: "1006" },
    { nombre: "Bancolombia", codigo: "1007" },
    { nombre: "Citibank", codigo: "1009" },
    { nombre: "Banco GNB Sudameris", codigo: "1012" },
    { nombre: "BBVA Colombia", codigo: "1013" },
    { nombre: "Itaú", codigo: "1014" },
    { nombre: "Scotiabank Colpatria", codigo: "1019" },
    { nombre: "Banco de Occidente", codigo: "1023" },
    { nombre: "Bancóldex", codigo: "1031" },
    { nombre: "Banco Caja Social", codigo: "1032" },
    { nombre: "Banco Agrario", codigo: "1040" },
    { nombre: "Banco Mundo Mujer", codigo: "1047" },
    { nombre: "Davivienda", codigo: "1051" },
    { nombre: "Banco AV Villas", codigo: "1052" },
    { nombre: "Banco W", codigo: "1053" },
    { nombre: "Bancamía", codigo: "1059" },
    { nombre: "Banco Pichincha", codigo: "1060" },
    { nombre: "Bancoomeva", codigo: "1061" },
    { nombre: "Banco Falabella", codigo: "1062" },
    { nombre: "Banco Finandina", codigo: "1063" },
    { nombre: "Banco Santander", codigo: "1065" },
    { nombre: "Banco Cooperativo Coopcentral", codigo: "1066" },
    { nombre: "Mibanco", codigo: "1067" },
    { nombre: "Banco Serfinanza", codigo: "1069" },
    { nombre: "Lulo Bank", codigo: "1070" },
    { nombre: "J.P. Morgan", codigo: "1071" },
    { nombre: "Financiera Juriscoop", codigo: "1121" },
    { nombre: "Cooperativa de Antioquia", codigo: "1283" },
    { nombre: "JFK Cooperativa", codigo: "1286" },
    { nombre: "Cootrafa", codigo: "1289" },
    { nombre: "Confiar Cooperativa", codigo: "1292" },
    { nombre: "Banco Unión", codigo: "1303" },
    { nombre: "Coltefinanciera", codigo: "1370" },
    { nombre: "Nequi", codigo: "1507" },
    { nombre: "Daviplata", codigo: "1551" },
    { nombre: "Banco Credifinanciera", codigo: "1558" },
    { nombre: "Pibank", codigo: "1560" },
    { nombre: "Iris", codigo: "1637" },
    { nombre: "Movii", codigo: "1801" },
    { nombre: "Ding Tecnipagos", codigo: "1802" },
    { nombre: "Powwi", codigo: "1803" },
    { nombre: "Ualá", codigo: "1804" },
    { nombre: "Banco BTG Pactual", codigo: "1805" },
    { nombre: "Bold CF", codigo: "1808" },
    { nombre: "Nu", codigo: "1809" },
    { nombre: "Rappipay", codigo: "1811" },
    { nombre: "Coink", codigo: "1812" },
    { nombre: "Global66", codigo: "1814" },
    { nombre: "Banco Contactar", codigo: "1819" }
  ]);
});

// 🚀 Inicialización del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
