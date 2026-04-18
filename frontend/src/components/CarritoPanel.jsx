import React from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "./CarritoPanel.css";

const CarritoPanel = ({ onClose }) => {
  const { carrito, aumentarCantidad, disminuirCantidad, eliminarDelCarrito, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  return (
    <div className="carrito-panel-overlay" onClick={onClose}>
      <div className="carrito-panel" onClick={(e) => e.stopPropagation()}>
        <h2>🛒 Tu carrito</h2>

        {carrito.length === 0 ? (
          <p>No tienes productos en el carrito.</p>
        ) : (
          <>
            <ul>
              {carrito.map((item) => (
                <li key={item._id} className="carrito-item">
                  <img src={item.imagenes[0]} alt={item.nombre} />
                  <div className="carrito-info">
                    <p>{item.nombre}</p>
                    <p>${item.precio} COP</p>
                    <div className="carrito-controles">
                      <button onClick={() => disminuirCantidad(item._id)}>-</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => aumentarCantidad(item._id)}>+</button>
                    </div>
                    <button
                      className="carrito-eliminar"
                      onClick={() => eliminarDelCarrito(item._id)}
                    >
                      ❌ Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <h3>Total: ${total} COP</h3>

            <div className="carrito-panel-botones">
              <button
                className="carrito-vaciar"
                onClick={() => {
                  vaciarCarrito();
                  onClose();
                }}
              >
                🗑️ Vaciar carrito
              </button>

              <button
                className="carrito-finalizar"
                onClick={() => {
                  onClose();
                  navigate("/pago");
                }}
              >
                ✅ Finalizar compra
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CarritoPanel;