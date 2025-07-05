const express = require('express');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config(); // 📦 Cargamos las variables de entorno

// 🧠 Importamos el modelo de pagos
const Pago = require('../models/Pago');

router.post('/', async (req, res) => {
  try {
    const rawBody = req.body; // 📦 Buffer crudo desde express.raw()
    const signature = req.header('X-Integrity'); // 🔐 Firma enviada por Wompi

    // 🔍 Verificamos que sea Buffer antes de firmar
    if (!Buffer.isBuffer(rawBody)) {
      console.error('❌ El cuerpo no es un Buffer. Verifica express.raw() en server.js');
      return res.status(500).send('Formato de cuerpo inválido');
    }

    // 🧮 Calculamos la firma local
    const localSignature = crypto
      .createHmac('sha256', process.env.INTEGRITY_SECRET)
      .update(rawBody)
      .digest('hex');

    // 🧪 Log de comparación para depuración
    console.log("📦 Firma enviada por Wompi:", signature);
    console.log("🔐 Firma calculada localmente:", localSignature);

    // 🧱 Comparamos las firmas
    if (localSignature !== signature) {
      console.warn('❌ Firma HMAC inválida. El cuerpo fue modificado o la clave no coincide.');
      return res.status(401).send('Firma inválida');
    }

    // 🎉 Firma válida → parseamos a JSON
    const jsonBody = JSON.parse(rawBody);
    const { transaction } = jsonBody.data || {};

    if (!transaction || !transaction.reference || !transaction.status) {
      console.error('❌ Faltan campos obligatorios en el payload:', jsonBody);
      return res.status(400).send('Datos incompletos');
    }

    // 📝 Log del webhook válido
    console.log('📬 Webhook recibido y verificado');
    console.log(`🔗 Referencia: ${transaction.reference}`);
    console.log(`🔖 Estado: ${transaction.status}`);

    // 💾 Actualizamos en MongoDB
    const actualizado = await Pago.findOneAndUpdate(
      { reference: transaction.reference },
      { status: transaction.status },
      { new: true }
    );

    if (!actualizado) {
      console.warn('⚠️ No se encontró la orden con referencia:', transaction.reference);
    } else {
      console.log('✅ Estado actualizado en base de datos:', actualizado.status);
    }

    res.status(200).send('Webhook procesado');
  } catch (error) {
    console.error('❌ Error interno:', error);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
