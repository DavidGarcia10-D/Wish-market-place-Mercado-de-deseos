// 📌 Importamos React y el contexto global
import React, { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext"; // 📌 Accedemos al estado global del carrito
import axios from "axios"; // 📌 Importamos Axios para manejar la comunicación con el backend

const Carrito = () => {
  const { carrito, setCarrito } = useContext(CarritoContext); // 📌 Estado global del carrito

    // 🔥 NUEVO: Función para calcular el total del carrito 🔥
  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
  };

  // 📌 Función para eliminar productos del carrito
  const eliminarDelCarrito = (productoId) => {
    // 🔄 Filtramos el producto a eliminar y actualizamos el estado global
    const nuevoCarrito = carrito.filter((p) => p._id !== productoId);
    setCarrito(nuevoCarrito); 

    // 📌 Eliminamos también en el backend
    axios.delete(`http://localhost:3000/carrito/${productoId}`)
      .catch(err => console.error("❌ Error al eliminar producto:", err));
  };

  return (
    <div>
      <h2>🛒 Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        carrito.map((producto) => (
          <div key={producto._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <h3>{producto.nombre}</h3>  {/* 📌 Nombre del producto */}

            {/* 📸 Imagen del producto */}
            <img src={producto.imagenUrl} alt={producto.nombre} width="100px" />

            <p><strong>Precio:</strong> ${producto.precio} USD</p>  {/* 💲 Precio */}
            <p><strong>Cantidad:</strong> {producto.cantidad}</p>  {/* 🔢 Cantidad seleccionada */}

            {/* 📌 Botón para eliminar productos del carrito */}
            <button onClick={() => eliminarDelCarrito(producto._id)}>❌ Eliminar</button>  
          </div>
        ))
      )}

          {/* 🔥 NUEVO: Mostramos el total del carrito 🔥 */}
          <h3>Total a pagar: ${calcularTotal().toFixed(2)} $COP</h3>
    </div>
  );
};

export default Carrito;
