// 📌 Importamos las librerías necesarias
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/Product");
require("dotenv").config(); // 🔥 NUEVO: Cargamos las variables de entorno

// 📌 Importamos módulos adicionales
const carritoRoutes = require("./routes/carrito"); // 🔄 Rutas del carrito
const pagoRoutes = require("./routes/pago"); // 🔥 NUEVO: Importamos las rutas de pago

// 📌 Inicializamos la aplicación Express
const app = express();
app.use(cors({ origin: "http://localhost:5000" }));
app.use(express.json());

// 📌 Conectamos a MongoDB con manejo de errores
const mongoURI = "mongodb://127.0.0.1:27017/miBaseDeDatos";
mongoose.connect(mongoURI)
.then(() => console.log("🔗 Conectado a MongoDB"))
.catch(err => {
  console.error("❌ Error al conectar a MongoDB:", err);
  process.exit(1);
});

// 📌 🔥 NUEVO: Verificamos que las variables de entorno de Wompi están cargando correctamente
console.log("🔑 Llave privada de Wompi:", process.env.PRIVATE_KEY);
console.log("🔑 Llave pública de Wompi:", process.env.PUBLIC_KEY);

// 📌 Ruta de prueba para confirmar que el backend está corriendo
app.get("/", (req, res) => {
  res.send("🚀 ¡Servidor funcionando correctamente!");
});

// 📌 Ruta para obtener todos los productos desde MongoDB
app.get("/productos", async (req, res) => {
  try {
    const productos = await Product.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error("❌ Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// 📌 Ruta para agregar un nuevo producto
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

// 📌 Conectar las rutas del carrito
app.use("/carrito", carritoRoutes); // 🔄 Agregamos soporte para el carrito

// 📌 🔥 NUEVO: Conectar las rutas de pago con PSE 🔥
app.use("/pago", pagoRoutes); // 📌 Esto permite que el backend reconozca la ruta "/pago/pse"

// 📌 🔥 NUEVO: Definir la ruta `/bancos` directamente en `server.js` para evitar errores
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

// 📌 Inicializamos el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Backend corriendo en http://localhost:${PORT}`));
