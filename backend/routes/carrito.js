const express = require("express");
const router = express.Router();
const Carrito = require("../models/carrito");

// 📌 Ruta para agregar productos al carrito
router.post("/", async (req, res) => {
  const { usuario, productoId, cantidad, total } = req.body;

  if (!usuario || !productoId || !cantidad || !total) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    let carrito = await Carrito.findOne({ usuario });

    if (!carrito) {
      carrito = new Carrito({ usuario, productos: [], total: 0 });
    }

    const index = carrito.productos.findIndex(p => p.productoId.toString() === productoId);

    if (index !== -1) {
      // Si ya existe, actualiza cantidad
      carrito.productos[index].cantidad += cantidad;
    } else {
      // Si no existe, lo agrega
      carrito.productos.push({ productoId, cantidad });
    }

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
    if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 Ruta para eliminar un producto del carrito
router.delete("/:usuarioId/:productoId", async (req, res) => {
  try {
    const carrito = await Carrito.findOne({ usuario: req.params.usuarioId });
    if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

    carrito.productos = carrito.productos.filter(p => p.productoId.toString() !== req.params.productoId);
    await carrito.save();
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
