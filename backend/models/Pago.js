const mongoose = require("mongoose");

// 📄 Esquema para pagos registrados en MongoDB
const PagoSchema = new mongoose.Schema({
  reference: {
    type: String,
    required: true,
    unique: true // 🚨 Evita duplicados por referencia de transacción
  },

  amount_in_cents: {
    type: Number,
    required: true // 💰 Monto total en centavos (ej: 160000 = $1.600)
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
    type: String // 🏦 Banco elegido por el cliente
  },

  customer_email: {
    type: String // 📧 Correo registrado en Wompi
  },

  user_email: {
    type: String // 🧑 Correo capturado desde tu frontend (si aplica)
  },

  attempts: {
    type: Number,
    default: 1 // 🔁 Intentos con misma referencia (útil para reintentos)
  },

  reject_reason: {
    type: String // ❌ Motivo de rechazo (si lo devuelve Wompi)
  },

  productos: [
    {
      nombre: { type: String },
      precio: { type: Number },
      cantidad: { type: Number }
    }
  ]
}, {
  timestamps: true // 🕓 Registra `createdAt` y `updatedAt` automáticamente
});

// ✅ Exportamos el modelo
module.exports = mongoose.model("Pago", PagoSchema);
