import React, { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import axios from "axios";

const Carrito = () => {
  const { carrito, setCarrito } = useContext(CarritoContext);

  // 🔢 Calcula el total acumulado del carrito
  const calcularTotal = () =>
    carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);

  // 🗑️ Elimina un producto por ID (también lo elimina del backend)
  const eliminarDelCarrito = (productoId) => {
    const nuevoCarrito = carrito.filter((p) => p._id !== productoId);
    setCarrito(nuevoCarrito);

    axios.delete(`http://localhost:3000/carrito/${productoId}`)
      .catch(err => console.error("❌ Error al eliminar producto:", err));
  };

  return (
    <div>
      <h2>🛒 Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        carrito.map((producto, index) => (
          <div
            key={`${producto._id}-${index}`} // ✅ Clave única incluso si hay duplicados
            style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
          >
            <h3>{producto.nombre}</h3>

            {/* 📸 Imagen del producto */}
            <img src={producto.imagenUrl} alt={producto.nombre} width="100px" />

            <p><strong>Precio:</strong> ${producto.precio} USD</p>
            <p><strong>Cantidad:</strong> {producto.cantidad}</p>

            <button onClick={() => eliminarDelCarrito(producto._id)}>❌ Eliminar</button>
          </div>
        ))
      )}

      <h3>Total a pagar: ${calcularTotal().toFixed(2)} $COP</h3>
    </div>
  );
};

export default Carrito;
