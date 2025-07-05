// 	Modelo de Mongoose para MongoDB
const mongoose = require("mongoose");

// 📄 Esquema del modelo de pago
const PagoSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },  // Referencia única (Wompi)
  status: { type: String, required: true },                   // Estado de la transacción (APPROVED, DECLINED, etc.)
  amount_in_cents: Number,                                    // Monto total del pago
  customer_email: String,                                     // Correo del comprador
  created_at: { type: Date, default: Date.now }               // Fecha de creación del registro
});

// ✅ Exportamos el modelo
module.exports = mongoose.model("Pago", PagoSchema);
