const mongoose = require("mongoose");

// Definir el esquema de producto con imágenes
const ProductSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true }, // Nombre sin espacios extra
    precio: { type: Number, required: true, min: 0 }, // Precio obligatorio, no puede ser negativo
    descripcion: { type: String, default: "Sin descripción" }, // Descripción opcional
    categoria: { type: String, enum: ["Electrónica", "Hogar", "Ropa", "Otros"], default: "Otros" }, // Categoría predefinida
    stock: { type: Number, default: 0, min: 0 }, // Stock inicial en 0
    fechaCreacion: { type: Date, default: Date.now }, // Fecha de creación automática
    imagenUrl: { type: String, required: true } // **Nueva propiedad**: URL de la imagen del producto
});

// Crear el modelo Product basado en el esquema
const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;



