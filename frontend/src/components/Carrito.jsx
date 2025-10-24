// frontend/src/components/Carrito.jsx

import React, { useContext } from "react";
import { CarritoContext } from "../context/CarritoContext";
import { showSuccess } from "../utils/toast";
import "./Carrito.css";

const Carrito = () => {
  const { carrito, setCarrito } = useContext(CarritoContext);

  const eliminarDelCarrito = (id) => {
    const nuevoCarrito = carrito.filter(item => item._id !== id);
    setCarrito(nuevoCarrito);
    showSuccess("❌ Producto eliminado del carrito");
  };

  const modificarCantidad = (id, delta) => {
    const nuevoCarrito = carrito.map(item => {
      if (item._id === id) {
        const nuevaCantidad = Math.max(item.cantidad + delta, 1);
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    });
    setCarrito(nuevoCarrito);
  };

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div className="carrito-contenedor">
      <h2 className="carrito-titulo">🛒 Tu carrito de compras</h2>

      {carrito.length === 0 ? (
        <p className="carrito-vacio">
          🧺 El carrito está vacío. ¡Agrega productos para comenzar!
        </p>
      ) : (
        <div className="carrito-lista">
          {carrito.map(item => (
            <div key={item._id} className="carrito-item">
              <img
                src={item.imagenUrl || "/imagenes/default.jpg"}
                alt={item.nombre}
                className="carrito-imagen"
                onError={(e) => e.target.src = "/imagenes/default.jpg"}
              />
              <div className="carrito-info">
                <h4 className="carrito-nombre">{item.nombre}</h4>
                <p className="carrito-texto">
                  Precio:{" "}
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0
                  }).format(item.precio)}
                </p>

                <div className="carrito-cantidad-control">
                  <button
                    className="carrito-boton-cantidad"
                    onClick={() => modificarCantidad(item._id, -1)}
                  >
                    −
                  </button>
                  <span>{item.cantidad}</span>
                  <button
                    className="carrito-boton-cantidad"
                    onClick={() => modificarCantidad(item._id, 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="carrito-boton-eliminar"
                  onClick={() => eliminarDelCarrito(item._id)}
                >
                  ❌ Eliminar
                </button>
              </div>
            </div>
          ))}

          <h3 className="carrito-total">
            Total:{" "}
            {new Intl.NumberFormat("es-CO", {
              style: "currency",
              currency: "COP",
              minimumFractionDigits: 0
            }).format(total)}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Carrito;
