const mongoose = require('mongoose');

const envioSchema = new mongoose.Schema({
  id_pago: { type: mongoose.Schema.Types.ObjectId, ref: 'Pago', required: true },
  nombre_destinatario: { type: String, required: true },
  telefono_destinatario: { type: String, required: true },
  direccion: { type: String, required: true },
  ciudad: { type: String, required: true },
  tipo_entrega: { type: String, enum: ['normal', 'express'], default: 'normal' },
  estado_envio: { type: String, default: 'pendiente' },
  tracking_id: { type: String, default: null },
  fecha_creacion: { type: Date, default: Date.now },
  fecha_actualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Envio', envioSchema);
