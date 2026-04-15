const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Importa el modelo de producto

/**
 * 📦 Ruta: Listar todos los productos
 * GET /api/productos
 * Devuelve todos los productos de la base de datos
 */
router.get('/', async (req, res) => {
  try {
    const productos = await Product.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error('❌ Error al listar productos:', error);
    res.status(500).json({ mensaje: 'Error interno al listar productos' });
  }
});

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
 * 📦 Ruta: Obtener producto por ID
 * GET /api/productos/:id
 * Devuelve un producto específico según su _id
 */
router.get('/:id', async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }

    res.status(200).json(producto);
  } catch (error) {
    console.error('❌ Error al obtener producto por ID:', error);
    res.status(500).json({ mensaje: 'Error interno al buscar producto' });
  }
});

module.exports = router;