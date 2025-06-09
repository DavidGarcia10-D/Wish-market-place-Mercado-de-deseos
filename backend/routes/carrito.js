const express = require("express");
const router = express.Router();
const Carrito = require("../models/carrito");

// 📌 Ruta para agregar productos al carrito
router.post("/", async (req, res) => {
  const { usuario, productoId, cantidad, total } = req.body;
  try {
    const carrito = await Carrito.findOne({ usuario }) || new Carrito({ usuario, productos: [], total: 0 });
    carrito.productos.push({ productoId, cantidad });
    carrito.total += total;
    await carrito.save();
    res.status(201).json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Ruta para obtener el carrito del usuario
router.get("/:usuarioId", async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.params.usuarioId }).populate("productos.productoId");
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Ruta para eliminar un producto del carrito
router.delete("/:usuarioId/:productoId", async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.params.usuarioId });
    carrito.productos = carrito.productos.filter(p => p.productoId.toString() !== req.params.productoId);
    await carrito.save();
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
