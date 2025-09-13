const express = require('express');
const router = express.Router();
const Envio = require('../models/Envio');

router.post('/crear-envio', async (req, res) => {
  try {
    const nuevoEnvio = new Envio(req.body);
    const guardado = await nuevoEnvio.save();
    res.status(201).json(guardado);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear el envío', detalle: err.message });
  }
});

module.exports = router;
