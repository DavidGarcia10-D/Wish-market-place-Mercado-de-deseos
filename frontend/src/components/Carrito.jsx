import React from "react";
import { useCarrito } from "../context/CarritoContext";
import { showSuccess } from "../utils/toast";
import { useNavigate } from "react-router-dom";   // 👈 Importar
import "./Carrito.css";

const Carrito = () => {
  const { carrito, eliminarDelCarrito, vaciarCarrito, modificarCantidad } = useCarrito();
  const navigate = useNavigate();   // 👈 Hook para navegar

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
                src={item.imagenes && item.imagenes.length > 0 ? item.imagenes[0] : "/imagenes/default.jpg"}
                alt={item.nombre}
                className="carrito-imagen"
                onError={(e) => (e.target.src = "/imagenes/default.jpg")}
              />
              <div className="carrito-info">
                <h4 className="carrito-nombre">{item.nombre}</h4>
                <p className="carrito-texto">
                  Precio:{" "}
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(item.precio)}
                </p>

                <div className="carrito-cantidad-control">
                  <button
                    className="carrito-boton-cantidad"
                    onClick={() => {
                      modificarCantidad(item._id, -1);
                      showSuccess("🔄 Cantidad actualizada");
                    }}
                  >
                    −
                  </button>
                  <span>{item.cantidad}</span>
                  <button
                    className="carrito-boton-cantidad"
                    onClick={() => {
                      modificarCantidad(item._id, 1);
                      showSuccess("🔄 Cantidad actualizada");
                    }}
                  >
                    +
                  </button>
                </div>

                <button
                  className="carrito-boton-eliminar"
                  onClick={() => {
                    eliminarDelCarrito(item._id);
                    showSuccess("❌ Producto eliminado del carrito");
                  }}
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
              minimumFractionDigits: 0,
            }).format(total)}
          </h3>

          <div className="carrito-acciones">
            <button className="carrito-boton-vaciar" onClick={vaciarCarrito}>
              🗑️ Vaciar carrito
            </button>

            <button
              className="carrito-boton-finalizar"
              onClick={() => navigate("/pago")}   // 👈 Redirige al formulario de pago
            >
              ✅ Finalizar compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;