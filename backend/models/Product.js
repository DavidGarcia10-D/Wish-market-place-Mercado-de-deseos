const mongoose = require("mongoose");

// Definir el esquema de producto con un array de imágenes
const ProductSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  precio: { type: Number, required: true, min: 0 },
  descripcion: { type: String, default: "Sin descripción" },
  categoria: { 
    type: String, 
    enum: ["Electrónica", "Hogar", "Ropa", "Otros"], 
    default: "Otros" 
  },
  stock: { type: Number, default: 0, min: 0 },
  fechaCreacion: { type: Date, default: Date.now },
  // ✅ Solo array, la primera posición es la imagen principal
  imagenes: { type: [String], default: [] }
});

// Crear el modelo Product basado en el esquema
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;