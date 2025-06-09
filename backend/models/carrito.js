const mongoose = require("mongoose");

// 📌 Definimos el esquema de carrito con productos y usuario opcional
const CarritoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Opcional para compras sin login
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
      cantidad: { type: Number, required: true, default: 1 }
    }
  ],
  total: { type: Number, required: true } // Precio total del carrito
});

// 📌 Exportamos el modelo de carrito
const Carrito = mongoose.model("Carrito", CarritoSchema);
module.exports = Carrito;

