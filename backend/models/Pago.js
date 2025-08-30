const mongoose = require("mongoose");

// 📄 Esquema para pagos registrados en MongoDB
const PagoSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true, // 🚨 Evita duplicados por referencia de transacción
    trim: true
  },

  amount_in_cents: {
    type: Number,
    required: true, // 💰 Monto total en centavos (ej: 160000 = $1.600)
    min: 1500
  },

  status: {
    type: String,
    required: true,
    enum: ["PENDING", "APPROVED", "DECLINED", "VOIDED"], // 🔄 Estados válidos
    default: "PENDING"
  },

  payment_method_type: {
    type: String,
    default: "PSE" // 💳 Método: PSE, CARD, etc.
  },

  bank_name: {
    type: String, // 🏦 Banco elegido por el cliente
    trim: true
  },

  customer_email: {
    type: String, // 📧 Correo registrado en Wompi
    trim: true
  },

  user_email: {
    type: String, // 🧑 Correo capturado desde tu frontend (si aplica)
    trim: true
  },

  user_type: {
    type: Number, // 🔢 0 = Natural, 1 = Jurídica
    enum: [0, 1],
    default: 0
  },

  phone_number: {
    type: String, // 📞 Teléfono del cliente
    trim: true
  },

  payment_description: {
    type: String, // 🧾 Descripción del pago
    trim: true
  },

  attempts: {
    type: Number,
    default: 1 // 🔁 Intentos con misma referencia (útil para reintentos)
  },

  reject_reason: {
    type: String // ❌ Motivo de rechazo (si lo devuelve Wompi)
  },

  updated_by_webhook: {
    type: Boolean,
    default: false // 📡 Indica si el estado fue actualizado por webhook
  },

  productos: [
    {
      nombre: { type: String, required: true, trim: true },
      precio: { type: Number, required: true, min: 0 },
      cantidad: { type: Number, required: true, min: 1 }
    }
  ]
}, {
  timestamps: true // 🕓 Registra `createdAt` y `updatedAt` automáticamente
});

// ✅ Exportamos el modelo
module.exports = mongoose.model("Pago", PagoSchema);
