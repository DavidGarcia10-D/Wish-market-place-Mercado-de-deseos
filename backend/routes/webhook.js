const express = require('express');
const router = express.Router();
const crypto = require('crypto');
require('dotenv').config(); // 📦 Cargamos variables de entorno

const Pago = require('../models/Pago'); // 🧠 Modelo de pagos en MongoDB

// 🧬 Middleware esperado: app.use('/api/webhook', express.raw({ type: '*/*' }));

router.post('/', async (req, res) => {
  try {
    const rawBody = req.body; // 📥 Esperamos que venga como Buffer crudo
    const signature = req.header('X-Wompi-Signature'); // 🔐 Header correcto de Wompi

    // 🧱 Validamos que el cuerpo sea un Buffer
    if (!Buffer.isBuffer(rawBody)) {
      console.error('❌ El cuerpo no es un Buffer. Revisa uso de express.raw() en server.js');
      return res.status(500).send('Formato de cuerpo inválido');
    }

    // 🔒 Calculamos la firma local para comparar con la enviada
    const localSignature = crypto
      .createHmac('sha256', process.env.INTEGRITY_SECRET)
      .update(rawBody)
      .digest('hex');

    console.log('📦 Firma de Wompi:', signature);
    console.log('🔐 Firma calculada:', localSignature);

    // 🚨 Si las firmas no coinciden → rechazamos el evento
    if (localSignature !== signature) {
      console.warn('❌ Firma inválida. Posible alteración del cuerpo o secreto incorrecto.');
      return res.status(401).send('Firma inválida');
    }

    // 🎉 Firma válida → parseamos el cuerpo a JSON
    const jsonBody = JSON.parse(rawBody);

    // 🚦 Validamos el tipo de evento
    if (jsonBody.event !== 'transaction.updated') {
      console.log('📭 Evento no manejado:', jsonBody.event);
      return res.status(200).send('Evento ignorado');
    }

    // 🧩 Extraemos los datos de la transacción
    const { transaction } = jsonBody.data || {};
    if (!transaction?.reference || !transaction?.status) {
      console.error('❌ Faltan campos obligatorios:', jsonBody);
      return res.status(400).send('Datos incompletos');
    }

    console.log('📬 Webhook procesado:');
    console.log(`🔗 Referencia: ${transaction.reference}`);
    console.log(`🔖 Estado: ${transaction.status}`);

    // 💾 Actualizamos el estado del pago en MongoDB
    const actualizado = await Pago.findOneAndUpdate(
      { reference: transaction.reference },
      { status: transaction.status },
      { new: true }
    );

    if (!actualizado) {
      console.warn('⚠️ No se encontró el pago con esa referencia:', transaction.reference);
    } else {
      console.log('✅ Estado actualizado en BD:', actualizado.status);
    }

    res.status(200).send('Webhook recibido y procesado');
  } catch (error) {
    console.error('❌ Error al procesar webhook:', error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
