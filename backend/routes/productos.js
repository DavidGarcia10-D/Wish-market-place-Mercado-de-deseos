const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Importa el modelo de producto

/**
 * 🧩 Ruta: Obtener productos por categoría
 * GET /api/productos/categoria/:nombre
 * Devuelve todos los productos que coincidan con la categoría solicitada
 */
router.get('/categoria/:nombre', async (req, res) => {
  try {
    const categoria = req.params.nombre;
    const productos = await Product.find({ categoria: categoria });

    res.status(200).json(productos);
  } catch (error) {
    console.error('❌ Error al obtener productos por categoría:', error);
    res.status(500).json({ mensaje: 'Error interno al filtrar productos' });
  }
});

/**
 * 🧪 Ruta temporal protegida: Insertar productos de prueba por categoría
 * POST /api/productos/seed
 * Inserta un producto en cada categoría para pruebas funcionales
 * Requiere header: Authorization: Bearer <SEED_TOKEN>
 */
router.post('/seed', async (req, res) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${process.env.SEED_TOKEN}`) {
    return res.status(403).json({ error: "Acceso denegado" });
  }

  try {
    const productosDemo = [
      {
        nombre: "Audífonos Bluetooth",
        precio: 120000,
        descripcion: "Sonido envolvente y batería de larga duración",
        categoria: "Electrónica",
        stock: 10,
        imagenUrl: "/imagenes/audifonos.jpg"
      },
      {
        nombre: "Almohada Viscoelástica",
        precio: 85000,
        descripcion: "Ideal para dormir como un bebé",
        categoria: "Hogar",
        stock: 15,
        imagenUrl: "/imagenes/almohada.jpg"
      },
      {
        nombre: "Camisa Casual Hombre",
        precio: 65000,
        descripcion: "Estilo y comodidad para cualquier ocasión",
        categoria: "Ropa",
        stock: 20,
        imagenUrl: "/imagenes/camisa.jpg"
      },
      {
        nombre: "Tarjeta de regalo",
        precio: 50000,
        descripcion: "Perfecta para cualquier ocasión",
        categoria: "Otros",
        stock: 50,
        imagenUrl: "/imagenes/regalo.jpg"
      }
    ];

    await Product.insertMany(productosDemo);
    res.status(201).json({ mensaje: "✅ Productos de prueba insertados correctamente" });
  } catch (error) {
    console.error("❌ Error al insertar productos demo:", error);
    res.status(500).json({ error: "No se pudieron insertar los productos" });
  }
});

module.exports = router;
