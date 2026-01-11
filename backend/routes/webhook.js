const express = require("express");
const router = express.Router();
const crypto = require("crypto");
require("dotenv").config();

const Pago = require("../models/Pago");

router.post("/", async (req, res) => {
  try {
    const rawBody = req.body;
    const signature = req.header("X-Integrity");

    console.log("📥 Webhook recibido");
    console.log("📏 Tipo de req.body:", typeof rawBody);
    console.log("📦 ¿Es Buffer?:", Buffer.isBuffer(rawBody));

    if (!Buffer.isBuffer(rawBody)) {
      console.error("❌ El cuerpo no es un Buffer. Revisa express.raw() en server.js");
      return res.status(500).json({ error: "Formato de cuerpo inválido" });
    }

    const localSignature = crypto
      .createHmac("sha256", process.env.INTEGRITY_SECRET)
      .update(rawBody)
      .digest("hex");

    console.log("📦 Firma recibida:", signature);
    console.log("🔐 Firma calculada:", localSignature);

    if (localSignature !== signature) {
      console.warn("❌ Firma inválida. Posible alteración del cuerpo.");
      return res.status(401).json({ error: "Firma inválida" });
    }

    const jsonBody = JSON.parse(rawBody.toString("utf8"));

    if (jsonBody.event !== "transaction.updated") {
      console.log("📭 Evento no manejado:", jsonBody.event);
      return res.status(200).json({ ignored: true });
    }

    const { transaction } = jsonBody.data || {};
    if (!transaction?.reference || !transaction?.status) {
      console.error("❌ Faltan campos obligatorios:", jsonBody);
      return res.status(400).json({ error: "Datos incompletos" });
    }

    console.log("📬 Webhook procesado:");
    console.log(`🔗 Referencia: ${transaction.reference}`);
    console.log(`🔖 Estado: ${transaction.status}`);
    console.log(`🎫 CUS: ${transaction.cus || "N/A"}`);

    const actualizado = await Pago.findOneAndUpdate(
      { reference: transaction.reference },
      {
        status: transaction.status,
        cus: transaction.cus || undefined,
        reject_reason: transaction.reject_reason || undefined,
        updated_by_webhook: true,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!actualizado) {
      console.warn("⚠️ No se encontró el pago con esa referencia:", transaction.reference);
    } else {
      console.log("✅ Estado actualizado en BD:", actualizado.status);
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("❌ Error al procesar webhook:", error.message);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;